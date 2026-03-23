<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function index()
    {
        $units = Unit::orderBy('name')->get();
        return response()->json($units);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:units,name',
            'short_name' => 'required|string|max:10|unique:units,short_name',
        ]);

        $unit = Unit::create($validated);

        return response()->json($unit, 201);
    }

    public function show(Unit $unit)
    {
        return response()->json($unit);
    }

    public function update(Request $request, Unit $unit)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:units,name,' . $unit->id,
            'short_name' => 'required|string|max:10|unique:units,short_name,' . $unit->id,
        ]);

        $unit->update($validated);

        return response()->json($unit);
    }

    public function destroy(Unit $unit)
    {
        // Check if unit is in use
        $itemsCount = \App\Models\Item::where('unit_id', $unit->id)->count();
        if ($itemsCount > 0) {
            return response()->json([
                'message' => 'Cannot delete unit that is assigned to items'
            ], 422);
        }

        $unit->delete();

        return response()->json(['message' => 'Unit deleted successfully']);
    }
}
