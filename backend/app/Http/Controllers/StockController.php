<?php
namespace App\Http\Controllers;
use App\Models\StockBatch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class StockController extends Controller
{
    public function index()
    {
        return response()->json(StockBatch::with('product')->get());
    }
    public function summary()
    {
        $summary = StockBatch::with('product')
            ->select('product_id', DB::raw('SUM(quantity) as total_stock'), DB::raw('AVG(buying_price) as avg_price'))
            ->groupBy('product_id')
            ->get();
        return response()->json($summary);
    }
}