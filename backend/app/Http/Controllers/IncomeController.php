<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class IncomeController extends Controller
{
    public function index()
    {
        return Payment::where('type', 'in')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric',
            'payment_method' => 'required|string',
            'reference_id' => 'nullable|string',
            'expense_category' => 'required|string', // Set to "Other Income" by default but changeable
            'notes' => 'nullable|string',
        ]);

        $validated['type'] = 'in';
        return Payment::create($validated);
    }

    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();
        return response()->json(['message' => 'Income record deleted']);
    }
}