<?php

namespace App\Http\Controllers;

use App\Models\Creditor;
use Illuminate\Http\Request;

class CreditorController extends Controller
{
    public function index()
    {
        return Creditor::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'total_due' => 'numeric',
        ]);
        return Creditor::create($validated);
    }

    public function show(Creditor $creditor)
    {
        return $creditor;
    }

    public function update(Request $request, Creditor $creditor)
    {
        $validated = $request->validate([
            'name' => 'string',
            'total_due' => 'numeric',
        ]);
        $creditor->update($validated);
        return $creditor;
    }

    public function destroy(Creditor $creditor)
    {
        $creditor->delete();
        return response()->noContent();
    }
}
