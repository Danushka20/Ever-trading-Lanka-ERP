<?php

namespace App\Http\Controllers;

use App\Models\SalesArea;
use Illuminate\Http\Request;

class SalesAreaController extends Controller
{
    public function index()
    {
        return SalesArea::withCount(['dealers'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
        ]);
        return SalesArea::create($validated);
    }

    public function show(SalesArea $salesArea)
    {
        return $salesArea;
    }

    public function update(Request $request, SalesArea $salesArea)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
        ]);
        $salesArea->update($validated);
        return $salesArea;
    }

    public function destroy(SalesArea $salesArea)
    {
        // Check if there are any dealers assigned to this area
        if ($salesArea->dealers()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete Sales Area because it has assigned dealers. Please reassign dealers first.'
            ], 422);
        }

        // Check for invoices as well
        if ($salesArea->invoices()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete Sales Area because it is linked to existing invoices.'
            ], 422);
        }

        $salesArea->delete();
        return response()->noContent();
    }
}
