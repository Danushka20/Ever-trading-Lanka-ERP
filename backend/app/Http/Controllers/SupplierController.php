<?php
namespace App\Http\Controllers;
use App\Models\Supplier;
use Illuminate\Http\Request;
class SupplierController extends Controller
{
    public function index()
    {
        return response()->json(Supplier::all());
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "contact_person" => "nullable|string|max:255",
            "email" => "nullable|email|max:255",
            "phone" => "nullable|string|max:255",
            "secondary_phone" => "nullable|string|max:255",
            "whatsapp_number" => "nullable|string|max:255",
            "address" => "nullable|string",
            "address_line1" => "nullable|string|max:255",
            "address_line2" => "nullable|string|max:255",
            "address_line3" => "nullable|string|max:255",
            "main_town" => "nullable|string|max:255",
            "tax_id" => "nullable|string|max:255",
            "tin_number" => "nullable|string|max:255",
        ]);
        $supplier = Supplier::create($validated);
        return response()->json($supplier, 201);
    }
    public function show(Supplier $supplier)
    {
        return response()->json($supplier);
    }
    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "contact_person" => "nullable|string|max:255",
            "email" => "nullable|email|max:255",
            "phone" => "nullable|string|max:255",
            "secondary_phone" => "nullable|string|max:255",
            "whatsapp_number" => "nullable|string|max:255",
            "address" => "nullable|string",
            "address_line1" => "nullable|string|max:255",
            "address_line2" => "nullable|string|max:255",
            "address_line3" => "nullable|string|max:255",
            "main_town" => "nullable|string|max:255",
            "tax_id" => "nullable|string|max:255",
            "tin_number" => "nullable|string|max:255",
        ]);
        $supplier->update($validated);
        return response()->json($supplier);
    }
    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return response()->json(null, 204);
    }
}