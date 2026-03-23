<?php

namespace App\Http\Controllers;

use App\Models\Dealer;
use Illuminate\Http\Request;

class DealerController extends Controller
{
    public function index()
    {
        try {
            return Dealer::with(['salesPerson', 'salesArea'])->get();
        } catch (\Exception $e) {
            \Log::error('Dealers index error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'secondary_phone' => 'nullable|string|max:20',
            'fax_number' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'address_line1' => 'nullable|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'address_line3' => 'nullable|string|max:255',
            'main_town' => 'nullable|string|max:255',
            'category' => 'nullable|in:1,2,3,4',
            'sales_type' => 'nullable|string|max:100',
            'salesperson_id' => 'nullable|exists:users,id',
            'sales_area_id' => 'nullable|exists:sales_areas,id',
            'credit_limit' => 'nullable|numeric|min:0',
            'percentage' => 'nullable|numeric|min:0|max:100',
            'general_note' => 'nullable|string',
        ]);
        
        return Dealer::create($validated);
    }

    public function show(Dealer $dealer)
    {
        return $dealer->load(['salesPerson', 'salesArea']);
    }

    public function update(Request $request, Dealer $dealer)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'secondary_phone' => 'nullable|string|max:20',
            'fax_number' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'address_line1' => 'nullable|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'address_line3' => 'nullable|string|max:255',
            'main_town' => 'nullable|string|max:255',
            'category' => 'nullable|in:1,2,3,4',
            'sales_type' => 'nullable|string|max:100',
            'salesperson_id' => 'nullable|exists:users,id',
            'sales_area_id' => 'nullable|exists:sales_areas,id',
            'credit_limit' => 'nullable|numeric|min:0',
            'percentage' => 'nullable|numeric|min:0|max:100',
            'general_note' => 'nullable|string',
        ]);

        $dealer->update($validated);
        return $dealer;
    }

    public function destroy(Dealer $dealer)
    {
        $dealer->delete();
        return response()->noContent();
    }
}
