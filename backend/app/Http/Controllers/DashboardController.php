<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Item;
use App\Models\SalesArea;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalRevenue = Invoice::where('status', 'confirmed')->sum('total');
        $lowStockCount = Item::all()->filter(function($p) {
            return ($p->total_stock ?? 0) < ($p->reorder_level ?? 0);
        })->count();

        $activeAreas = SalesArea::count();
        $dailyTransactions = Transaction::whereDate('created_at', now())->count();

        $recentInvoices = Invoice::with('salesArea')
            ->where('status', 'confirmed')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'total_revenue' => $totalRevenue,
            'low_stock_count' => $lowStockCount,
            'active_areas' => $activeAreas,
            'daily_transactions' => $dailyTransactions,
            'recent_invoices' => $recentInvoices
        ]);
    }
}
