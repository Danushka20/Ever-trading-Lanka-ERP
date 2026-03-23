<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\ItemBatch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index()
    {
        return Invoice::with(['user', 'salesArea'])->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'invoice_no' => 'required|string|unique:invoices',
            'user_id' => 'required|exists:users,id',
            'sales_area_id' => 'required|exists:sales_areas,id',
            'customer_name' => 'required|string',
            'status' => 'required|in:hold,confirmed',
            'sub_total' => 'required|numeric',
            'discount' => 'numeric',
            'total' => 'required|numeric',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.qty' => 'required|numeric|min:1',
            'items.*.unit_price' => 'required|numeric',
            'items.*.total' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($request) {
            $invoice = Invoice::create($request->only([
                'invoice_no', 'user_id', 'sales_area_id', 'customer_name', 
                'status', 'sub_total', 'discount', 'total'
            ]));

            foreach ($request->items as $item) {
                // If batch_no is not provided, use a default value for database integrity
                $item['batch_no'] = $item['batch_no'] ?? 'Main';
                
                $invoice->items()->create($item);

                if ($invoice->status === 'confirmed') {
                    // Reduce from total stock of the item
                    $dbItem = \App\Models\Item::find($item['item_id']);
                    if (!$dbItem || $dbItem->total_stock < $item['qty']) {
                        throw new \Exception("Insufficient stock for item ID {$item['item_id']}");
                    }
                    
                    $dbItem->total_stock -= $item['qty'];
                    $dbItem->save();

                    // Optional: You might want to deduct from batches using FIFO if needed, 
                    // but for now we just track total stock for POS simplicty as requested.
                }
            }

            return $invoice->load('items');
        });
    }

    public function show(Invoice $invoice)
    {
        return $invoice->load(['items.product', 'user', 'salesArea']);
    }

    public function update(Request $request, Invoice $invoice)
    {
        if ($invoice->status === 'confirmed') {
            return response()->json(['error' => 'Confirmed invoices cannot be edited'], 400);
        }

        $validated = $request->validate([
            'status' => 'required|in:hold,confirmed',
        ]);

        return DB::transaction(function () use ($validated, $invoice) {
            $invoice->update($validated);

            if ($invoice->status === 'confirmed') {
                foreach ($invoice->items as $item) {
                    $dbItem = \App\Models\Item::find($item->item_id);
                    if (!$dbItem || $dbItem->total_stock < $item->qty) {
                         throw new \Exception("Insufficient stock for item ID {$item->item_id}");
                    }
                    $dbItem->total_stock -= $item->qty;
                    $dbItem->save();
                }
            }

            return $invoice->load('items');
        });
    }

    public function pending()
    {
        return Invoice::where('status', 'hold')->with(['user', 'salesArea'])->get();
    }

    public function confirmed()
    {
        return Invoice::where('status', 'confirmed')->with(['user', 'salesArea'])->get();
    }
}
