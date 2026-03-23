<?php

namespace App\Http\Controllers;

use App\Models\SalesTarget;
use App\Models\Invoice;
use Illuminate\Http\Request;

class SalesTargetController extends Controller
{
    public function index()
    {
        return SalesTarget::with('user')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer',
            'target_amount' => 'required|numeric|min:0',
        ]);
        return SalesTarget::create($validated);
    }

    public function show(SalesTarget $salesTarget)
    {
        try {
            return $salesTarget->load('user');
        } catch (\Exception $e) {
            \Log::error("Error showing sales target: " . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function update(Request $request, SalesTarget $salesTarget)
    {
        $validated = $request->validate([
            'target_amount' => 'required|numeric|min:0',
        ]);
        $salesTarget->update($validated);
        return $salesTarget;
    }

    public function achievement(Request $request)
    {
        try {
            $targets = SalesTarget::all();
            foreach ($targets as $target) {
                $achieved = Invoice::where('user_id', $target->user_id)
                    ->where('status', 'confirmed')
                    ->whereMonth('created_at', $target->month)
                    ->whereYear('created_at', $target->year)
                    ->sum('total');
                
                $target->achieved_amount = $achieved;
                $target->save();
            }

            return SalesTarget::with('user')->get();
        } catch (\Exception $e) {
            \Log::error("Achievement calculation failed: " . $e->getMessage());
            return response()->json(['error' => 'Failed to calculate achievement'], 500);
        }
    }

    public function destroy(SalesTarget $salesTarget)
    {
        $salesTarget->delete();
        return response()->noContent();
    }
}
