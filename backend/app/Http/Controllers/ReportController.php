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

    public function profitLossReport(Request $request)
    {
        $startDate = $request->query('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->query('end_date', now()->endOfMonth()->toDateString());

        // 1. Revenue (Confirmed Invoices)
        $revenue = DB::table('invoices')
            ->where('status', 'confirmed')
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('total');

        // 2. Cost of Sales Components
        // Opening Stock: Sum of (opening_qty * cost_price) from batches existing before start date
        $openingStock = DB::table('stock_batches')
            ->where('created_at', '<', $startDate)
            ->sum(DB::raw('opening_qty * cost_price'));

        // Purchases: All purchases during the period
        $purchases = DB::table('stock_batches')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum(DB::raw('opening_qty * cost_price'));

        // Closing Stock: Value of current inventory at end date
        // For simplicity, we use current qty
        $closingStock = DB::table('stock_batches')
            ->sum(DB::raw('qty * cost_price'));

        $costOfSales = ($openingStock + $purchases) - $closingStock;

        // 3. Gross Profit
        $grossProfit = $revenue - $costOfSales;

        // 4. Other Income
        $otherIncome = DB::table('payments')
            ->where('type', 'in')
            ->where('expense_category', 'Other Income')
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('amount');

        // 5. Operating Expenses
        $operatingExpenses = DB::table('payments')
            ->where('type', 'out')
            ->where('expense_category', 'Operating')
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('amount');

        // 6. Net Profit
        $netProfit = ($grossProfit + $otherIncome) - $operatingExpenses;

        return response()->json([
            'revenue' => (float)$revenue,
            'opening_stock' => (float)$openingStock,
            'purchases' => (float)$purchases,
            'closing_stock' => (float)$closingStock,
            'cost_of_sales' => (float)$costOfSales,
            'gross_profit' => (float)$grossProfit,
            'other_income' => (float)$otherIncome,
            'operating_expenses' => (float)$operatingExpenses,
            'net_profit' => (float)$netProfit,
            'period' => [
                'start' => $startDate,
                'end' => $endDate
            ]
        ]);
    }

    public function targetReport()
    {
        return SalesTarget::with('user')->get();
    }

    public function incomeStatement(Request $request)
    {
        $year = $request->query('year', now()->year);
        $startDate = "{$year}-01-01";
        $endDate = "{$year}-12-31";

        // Query summaries by month for the given year
        $monthlyRevenue = DB::table('invoices')
            ->where('status', 'confirmed')
            ->whereYear('date', $year)
            ->select(DB::raw('MONTH(date) as month'), DB::raw('SUM(total) as amount'))
            ->groupBy('month')
            ->get();

        $monthlyExpenses = DB::table('payments')
            ->where('type', 'out')
            ->whereYear('date', $year)
            ->select(DB::raw('MONTH(date) as month'), DB::raw('SUM(amount) as amount'))
            ->groupBy('month')
            ->get();

        // Map to 1-12 array
        $revenue = array_fill(1, 12, 0);
        $expenses = array_fill(1, 12, 0);

        foreach ($monthlyRevenue as $row) $revenue[$row->month] = (float)$row->amount;
        foreach ($monthlyExpenses as $row) $expenses[$row->month] = (float)$row->amount;

        $months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $data = [];

        for ($i = 1; $i <= 12; $i++) {
            $data[] = [
                'month' => $months[$i - 1],
                'revenue' => $revenue[$i],
                'expenses' => $expenses[$i],
                'profit' => $revenue[$i] - $expenses[$i]
            ];
        }

        // Totals
        $totalRevenue = array_sum($revenue);
        $totalExpenses = array_sum($expenses);
        $netProfit = $totalRevenue - $totalExpenses;

        return response()->json([
            'year' => (int)$year,
            'summary' => $data,
            'totals' => [
                'revenue' => $totalRevenue,
                'expenses' => $totalExpenses,
                'netProfit' => $netProfit,
            ]
        ]);
    }
}
