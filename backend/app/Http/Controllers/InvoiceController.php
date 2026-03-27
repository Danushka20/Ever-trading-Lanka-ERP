<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\ItemBatch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Events\EntityUpdated;

class InvoiceController extends Controller
{
    public function index()
    {
        return Invoice::with(['user', 'salesArea', 'items.item', 'dealer'])->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'invoice_no' => 'required|string|unique:invoices',
            'user_id' => 'required|exists:users,id',
            'sales_area_id' => 'required|exists:sales_areas,id',
            'dealer_id' => 'nullable',
            'customer_name' => 'required|string',
            'status' => 'required|in:hold,confirmed',
            'sub_total' => 'required|numeric',
            'discount' => 'numeric',
            'total' => 'required|numeric',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.description' => 'nullable|string',
            'items.*.qty' => 'required|numeric|min:1',
            'items.*.unit_price' => 'required|numeric',
            'items.*.total' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($request) {
            $data = $request->only([
                'invoice_no', 'user_id', 'sales_area_id', 'dealer_id', 'customer_name', 
                'status', 'sub_total', 'discount', 'total', 'settle_amount', 'invoice_date', 'due_date', 'notes'
            ]);

            if (isset($data['dealer_id']) && ($data['dealer_id'] === 'none' || $data['dealer_id'] === '')) {
                $data['dealer_id'] = null;
            }

            $invoice = Invoice::create($data);

            foreach ($request->items as $item) {
                // Map item_id to database structure
                $itemData = $item;
                if (!isset($itemData['batch_no'])) {
                    $itemData['batch_no'] = 'Main';
                }
                
                $invoice->items()->create($itemData);

                if ($invoice->status === 'confirmed') {
                    $itemId = $item['item_id'];
                    $qty = (float)$item['qty'];

                    // Reduce from total stock of the item
                    $dbItem = \App\Models\Item::find($itemId);
                    if (!$dbItem || (float)$dbItem->total_stock < $qty) {
                        return response()->json(['error' => "Insufficient stock for item ID {$itemId}"], 400);
                    }
                    
                    $dbItem->total_stock -= $qty;
                    $dbItem->save();

                    // Deduct from batches using FIFO logic
                    $remainingToDeduct = $qty;
                    $batches = \App\Models\ItemBatch::where('item_id', $itemId)
                        ->where('remaining_quantity', '>', 0)
                        ->orderBy('received_date', 'asc')
                        ->orderBy('id', 'asc')
                        ->get();

                    foreach ($batches as $batch) {
                        if ($remainingToDeduct <= 0) break;

                        $deduction = min((float)$batch->remaining_quantity, $remainingToDeduct);
                        $batch->remaining_quantity -= $deduction;
                        $batch->save();
                        $remainingToDeduct -= $deduction;
                    }

                    if ($remainingToDeduct > 0.001) { // Floating point safety
                        return response()->json(['error' => "Not enough batch stock for item ID {$itemId}"], 400);
                    }
                }
            }

            return $invoice->load('items');
        });
    }

    public function show(Invoice $invoice)
    {
        return $invoice->load(['items.item', 'user', 'salesArea']);
    }

    public function update(Request $request, Invoice $invoice)
    {
        if ($invoice->status === 'confirmed') {
            return response()->json(['error' => 'Confirmed invoices cannot be edited'], 400);
        }

        $validated = $request->validate([
            'dealer_id' => 'required|exists:dealers,id',
            'sales_area_id' => 'required|exists:sales_areas,id',
            'customer_name' => 'nullable|string',
            'invoice_date' => 'required|date',
            'discount' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'sub_total' => 'required|numeric',
            'total' => 'required|numeric',
            'status' => 'required|in:hold,confirmed',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.description' => 'nullable|string',
            'items.*.qty' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric',
            'items.*.total' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($validated, $invoice, $request) {
            // Update main invoice fields
            $invoice->update([
                'dealer_id' => $validated['dealer_id'],
                'sales_area_id' => $validated['sales_area_id'],
                'customer_name' => $validated['customer_name'],
                'invoice_date' => $validated['invoice_date'],
                'discount' => $validated['discount'],
                'settle_amount' => $request->settle_amount ?? 0,
                'notes' => $validated['notes'],
                'sub_total' => $validated['sub_total'],
                'total' => $validated['total'],
                'status' => $validated['status'],
            ]);

            // Sync items: Delete existing and recreate
            $invoice->items()->delete();
            
            foreach ($request->items as $item) {
                $itemData = $item;
                if (!isset($itemData['batch_no'])) {
                    $itemData['batch_no'] = 'Main';
                }
                $invoice->items()->create($itemData);
            }

            // If transitioning to confirmed, handle stock deduction
            if ($invoice->status === 'confirmed') {
                foreach ($invoice->items as $item) {
                    $itemId = $item->item_id;
                    $qty = (float)$item->qty;

                    $dbItem = \App\Models\Item::find($itemId);
                    if (!$dbItem || (float)$dbItem->total_stock < $qty) {
                        return response()->json(['error' => "Insufficient stock for item ID {$itemId}"], 400);
                    }
                    
                    $dbItem->total_stock -= $qty;
                    $dbItem->save();

                    // Deduct from batches using FIFO logic
                    $remainingToDeduct = $qty;
                    $batches = \App\Models\ItemBatch::where('item_id', $itemId)
                        ->where('remaining_quantity', '>', 0)
                        ->orderBy('received_date', 'asc')
                        ->orderBy('id', 'asc')
                        ->get();

                    foreach ($batches as $batch) {
                        if ($remainingToDeduct <= 0) break;

                        $deduction = min((float)$batch->remaining_quantity, $remainingToDeduct);
                        $batch->remaining_quantity -= $deduction;
                        $batch->save();
                        $remainingToDeduct -= $deduction;
                    }

                    if ($remainingToDeduct > 0.001) { // Floating point safety
                        return response()->json(['error' => "Not enough batch stock for item ID {$itemId}"], 400);
                    }
                }
            }

            return $invoice->load(['items.item', 'user', 'salesArea']);
        });
    }

    public function pending()
    {
        return Invoice::where('status', 'hold')->with(['user', 'salesArea', 'items.item', 'dealer'])->get();
    }

    public function confirmed()
    {
        return Invoice::whereIn('status', ['confirmed', 'partial', 'completed'])->with(['user', 'salesArea', 'items.item', 'dealer'])->get();
    }

    public function settle(Request $request, Invoice $invoice)
    {
        try {
            $validated = $request->validate([
                'amount' => 'required|numeric|min:0.01',
            ]);

            $newSettleAmount = (float)($invoice->settle_amount ?? 0) + (float)$validated['amount'];
            $total = (float)$invoice->total;

            $invoice->update([
                'settle_amount' => $newSettleAmount,
                'status' => 'confirmed'
            ]);

            // Dispatch event for real-time updates
            event(new EntityUpdated('invoices', $invoice->id));

            return response()->json([
                'message' => 'Payment recorded successfully',
                'invoice' => $invoice->load(['items.item', 'user', 'salesArea', 'dealer'])
            ]);
        } catch (\Exception $e) {
            \Log::error('Settle Invoice failed: ' . $e->getMessage(), [
                'invoice_id' => $invoice->id,
                'request' => $request->all()
            ]);
            return response()->json(['error' => 'Failed to settle invoice: ' . $e->getMessage()], 500);
        }
    }
}
