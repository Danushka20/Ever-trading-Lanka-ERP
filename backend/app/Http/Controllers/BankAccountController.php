<?php

namespace App\Http\Controllers;

use App\Models\BankAccount;
use Illuminate\Http\Request;

class BankAccountController extends Controller
{
    public function index()
    {
        return BankAccount::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'balance' => 'numeric',
        ]);
        return BankAccount::create($validated);
    }

    public function show(BankAccount $bankAccount)
    {
        return $bankAccount;
    }

    public function update(Request $request, BankAccount $bankAccount)
    {
        $validated = $request->validate([
            'name' => 'string',
            'balance' => 'numeric',
        ]);
        $bankAccount->update($validated);
        return $bankAccount;
    }
}
