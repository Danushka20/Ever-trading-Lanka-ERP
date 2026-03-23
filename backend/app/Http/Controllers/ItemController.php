<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with(['category', 'unit', 'batches']);

        // Search filter
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Active filter
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $items = $query->orderBy('name')->get();

        // Append computed attributes
        // $items->each(function ($item) {
        //     $item->total_stock = $item->total_stock;
        //     $item->unit_price = $item->batches->first()?->unit_price ?? 0;
        // });

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'unit_id' => 'nullable|exists:units,id',
            'sku' => 'nullable|string|unique:items,sku',
            'barcode' => 'nullable|string',
            'buy_price' => 'nullable|numeric|min:0',
            'unit_price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'reorder_level' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $item = Item::create($validated);

        return response()->json($item->load(['category', 'unit']), 201);
    }

    public function show(Item $item)
    {
        return response()->json($item->load(['category', 'unit', 'batches']));
    }

    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'unit_id' => 'nullable|exists:units,id',
            'sku' => 'nullable|string|unique:items,sku,' . $item->id,
            'barcode' => 'nullable|string',
            'buy_price' => 'nullable|numeric|min:0',
            'unit_price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'reorder_level' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $item->update($validated);

        return response()->json($item->load(['category', 'unit']));
    }

    public function destroy(Item $item)
    {
        // Check if item has batches with stock
        if ($item->total_stock > 0) {
            return response()->json([
                'message' => 'Cannot delete item with existing stock. Please clear stock first.'
            ], 422);
        }

        $item->delete();

        return response()->json(['message' => 'Item deleted successfully']);
    }
}
