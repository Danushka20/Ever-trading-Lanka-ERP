<?php

namespace App\Http\Controllers;

use App\Models\StockBatch;
use App\Models\ItemBatch;
use Illuminate\Http\Request;

class StockBatchController extends Controller
{
    public function index()
    {
        return ItemBatch::with('item')->get()->map(function ($batch) {
            return [
                'id' => $batch->id,
                'item_id' => $batch->item_id,
                'batch_number' => $batch->batch_number,
                'batch_no' => $batch->batch_number,
                'expiry_date' => $batch->expiry_date,
                'quantity' => $batch->remaining_quantity,
                'qty' => $batch->remaining_quantity,
                'cost_price' => $batch->cost_price,
                'unit_cost' => $batch->cost_price,
                'created_at' => $batch->created_at,
                'updated_at' => $batch->updated_at,
            ];
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'batch_no' => 'required|string',
            'qty' => 'required|numeric|min:0',
        ]);
        return StockBatch::create($validated);
    }

    public function show(StockBatch $stockBatch)
    {
        return $stockBatch->load('product');
    }

    public function update(Request $request, StockBatch $stockBatch)
    {
        $validated = $request->validate([
            'qty' => 'required|numeric|min:0',
        ]);
        $stockBatch->update($validated);
        return $stockBatch;
    }

    public function reduceStock(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'batch_no' => 'required|string',
            'qty' => 'required|numeric|min:1',
        ]);

        $batch = StockBatch::where('product_id', $request->product_id)
            ->where('batch_no', $request->batch_no)
            ->first();

        if (!$batch || $batch->qty < $request->qty) {
            return response()->json(['error' => 'Insufficient stock in batch'], 400);
        }

        $batch->qty -= $request->qty;
        $batch->save();

        return $batch;
    }
}
