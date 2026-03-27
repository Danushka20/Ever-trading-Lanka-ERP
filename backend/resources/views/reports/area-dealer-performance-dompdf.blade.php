<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Dealer Performance Report - {{ $area->name }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #222; }
        h1 { font-size: 18px; margin: 0 0 6px 0; }
        h2 { font-size: 13px; margin: 14px 0 6px 0; }
        .meta { margin-bottom: 12px; }
        .meta p { margin: 2px 0; }
        .logo { max-width: 90px; max-height: 60px; margin-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th, td { border: 1px solid #ccc; padding: 5px; }
        th { background-color: #f0f0f0; text-align: left; }
        .right { text-align: right; }
        .small { font-size: 10px; color: #555; }
        .totals td { font-weight: 700; }
    </style>
</head>
<body>
    @php
        $areaTotalSales = 0;
        $areaTotalSettled = 0;
        $areaTotalOutstanding = 0;
        $areaInvoiceCount = 0;

        foreach ($dealers as $dealer) {
            foreach ($dealer->invoices as $invoice) {
                $invoiceOutstanding = $invoice->total - $invoice->settle_amount;
                $areaTotalSales += $invoice->total;
                $areaTotalSettled += $invoice->settle_amount;
                $areaTotalOutstanding += $invoiceOutstanding;
                $areaInvoiceCount++;
            }
        }
    @endphp

    @if(!empty($company_logo_src))
        <img src="{{ $company_logo_src }}" alt="Company Logo" class="logo">
    @endif

    <h1>Dealer Performance & Outstanding Report</h1>
    <div class="meta">
        <p><strong>Sales Area:</strong> {{ $area->name }}</p>
        <p><strong>Company:</strong> {{ $company_name ?? 'ERP System' }}</p>
        @if(!empty($company_address))<p>{{ $company_address }}</p>@endif
        @if(!empty($company_phone) || !empty($company_email) || !empty($company_website))
            <p>
                {{ $company_phone ?? '' }}
                @if(!empty($company_phone) && !empty($company_email)) | @endif
                {{ $company_email ?? '' }}
                @if((!empty($company_phone) || !empty($company_email)) && !empty($company_website)) | @endif
                {{ $company_website ?? '' }}
            </p>
        @endif
        <p><strong>Generated:</strong> {{ $generated_at }}</p>
        @if($start_date || $end_date)
            <p><strong>Period:</strong> {{ $start_date ?? 'Beginning' }} to {{ $end_date ?? 'Today' }}</p>
        @endif
    </div>

    <table>
        <tr>
            <th>Total Dealers</th>
            <th>Total Invoices</th>
            <th class="right">Total Sales (Rs.)</th>
            <th class="right">Total Settled (Rs.)</th>
            <th class="right">Total Outstanding (Rs.)</th>
        </tr>
        <tr>
            <td>{{ $dealers->count() }}</td>
            <td>{{ $areaInvoiceCount }}</td>
            <td class="right">{{ number_format($areaTotalSales, 2) }}</td>
            <td class="right">{{ number_format($areaTotalSettled, 2) }}</td>
            <td class="right">{{ number_format($areaTotalOutstanding, 2) }}</td>
        </tr>
    </table>

    @foreach($dealers as $dealer)
        @php
            $dealerSales = 0;
            $dealerSettled = 0;
            $dealerOutstanding = 0;
        @endphp

        <h2>{{ $dealer->name }}</h2>
        <p class="small">
            {{ $dealer->address ?? $dealer->main_town ?? 'No address provided' }}
            | Phone: {{ $dealer->phone ?? 'N/A' }}
            | Email: {{ $dealer->email ?? 'N/A' }}
        </p>

        <table>
            <thead>
                <tr>
                    <th>Invoice #</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th class="right">Total (Rs.)</th>
                    <th class="right">Settled (Rs.)</th>
                    <th class="right">Outstanding (Rs.)</th>
                </tr>
            </thead>
            <tbody>
                @forelse($dealer->invoices as $invoice)
                    @php
                        $outstanding = $invoice->total - $invoice->settle_amount;
                        $dealerSales += $invoice->total;
                        $dealerSettled += $invoice->settle_amount;
                        $dealerOutstanding += $outstanding;
                    @endphp
                    <tr>
                        <td>{{ $invoice->invoice_no }}</td>
                        <td>{{ \Carbon\Carbon::parse($invoice->invoice_date)->format('d M Y') }}</td>
                        <td>{{ $invoice->status }}</td>
                        <td class="right">{{ number_format($invoice->total, 2) }}</td>
                        <td class="right">{{ number_format($invoice->settle_amount, 2) }}</td>
                        <td class="right">{{ number_format($outstanding, 2) }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6">No invoices found for this dealer.</td>
                    </tr>
                @endforelse
            </tbody>
            <tfoot>
                <tr class="totals">
                    <td colspan="3" class="right">Dealer Totals</td>
                    <td class="right">{{ number_format($dealerSales, 2) }}</td>
                    <td class="right">{{ number_format($dealerSettled, 2) }}</td>
                    <td class="right">{{ number_format($dealerOutstanding, 2) }}</td>
                </tr>
            </tfoot>
        </table>
    @endforeach
</body>
</html>
