<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\StockBatch;
use App\Models\SalesTarget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function salesReport(Request $request)
    {
        $query = Invoice::where('status', 'confirmed')->with(['user', 'salesArea']);

        if ($request->has('sales_area_id')) {
            $query->where('sales_area_id', $request->sales_area_id);
        }

        return $query->get();
    }

    public function profitLossReport()
    {
        $revenue = InvoiceItem::whereHas('invoice', function($q) {
            $q->where('status', 'confirmed');
        })->sum('total');

        // Simplified cost calculation: sum of (qty * cost_price) from batches
        // Note: Real ERP would track specific batch costs at time of sale.
        $costOfGoodsSold = DB::table('invoice_items')
            ->join('invoices', 'invoice_items.invoice_id', '=', 'invoices.id')
            ->join('stock_batches', function($join) {
                $join->on('invoice_items.product_id', '=', 'stock_batches.product_id')
                     ->on('invoice_items.batch_no', '=', 'stock_batches.batch_no');
            })
            ->where('invoices.status', 'confirmed')
            ->sum(DB::raw('invoice_items.qty * stock_batches.cost_price'));

        return response()->json([
            'revenue' => $revenue,
            'cost_of_goods_sold' => $costOfGoodsSold,
            'gross_profit' => $revenue - $costOfGoodsSold
        ]);
    }

    public function targetReport()
    {
        return SalesTarget::with('user')->get();
    }
}
