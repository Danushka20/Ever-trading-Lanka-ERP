<?php
namespace App\Http\Controllers;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Item;
use App\Models\Product;
use App\Models\StockBatch;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class PurchaseController extends Controller
{
    public function index()
    {
        return response()->json(PurchaseOrder::with(['supplier', 'items.item'])->latest()->get());
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'total_amount' => 'required|numeric',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.batch_number' => 'nullable|string',
            'items.*.expiry_date' => 'nullable|date',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.unit_price' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($validated) {
            $purchase = PurchaseOrder::create([
                'supplier_id' => $validated['supplier_id'],
                'order_date' => $validated['order_date'],
                'total_amount' => $validated['total_amount'],
                'status' => 'received',
            ]);

            foreach ($validated['items'] as $item) {
                // Create PurchaseOrderItem using the correct item_id
                $poItem = PurchaseOrderItem::create([
                    'purchase_order_id' => $purchase->id,
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['quantity'] * $item['unit_price'],
                ]);

                // Also create an ItemBatch (using ItemBatch model instead of StockBatch)
                $batchNumber = $item['batch_number'] ?? ('AUTO-' . $item['item_id'] . '-' . now()->format('YmdHis'));

                \App\Models\ItemBatch::create([
                    'item_id' => $item['item_id'],
                    'purchase_order_item_id' => $poItem->id,
                    'batch_number' => $batchNumber,
                    'expiry_date' => $item['expiry_date'] ?? null,
                    'quantity' => $item['quantity'],
                    'remaining_quantity' => $item['quantity'],
                    'cost_price' => $item['unit_price'],
                    'received_date' => $validated['order_date'],
                ]);

                // Keep item-level stock and latest buying price in sync for stock summary screens.
                $dbItem = Item::find($item['item_id']);
                if ($dbItem) {
                    $dbItem->total_stock = (float) ($dbItem->total_stock ?? 0) + (float) $item['quantity'];
                    $dbItem->buy_price = $item['unit_price'];
                    $dbItem->save();
                }

                // Optional: You could also create/update StockBatch if needed for hybrid flow
                // But let's stick to ItemBatch as it's more complete for FIFO.
            }

            $supplier = Supplier::find($validated['supplier_id']);
            $supplier->increment('payable_balance', $validated['total_amount']);

            return response()->json($purchase->load('items'), 201);
        });
    }
    public function show($id)
    {
        return response()->json(PurchaseOrder::with(['supplier', 'items.product'])->findOrFail($id));
    }
}