<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Dealer Performance & Outstanding Report - {{ $area->name }}</title>
    <style>
        @page {
            margin: 24px 24px 34px 24px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #1e293b;
            line-height: 1.45;
        }

        .report-header {
            background: #f8fafc;
            border: 1px solid #dbe3ef;
            border-left: 5px solid #1d4ed8;
            border-radius: 8px;
            padding: 14px 16px;
            margin-bottom: 16px;
        }

        .header-company {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
            border-bottom: 1px solid #dbe3ef;
            padding-bottom: 8px;
        }

        .header-company td {
            vertical-align: top;
        }

        .logo-cell {
            width: 74px;
        }

        .company-logo {
            width: 60px;
            height: 60px;
            border: 1px solid #dbe3ef;
            border-radius: 8px;
            padding: 4px;
            background: #ffffff;
            object-fit: contain;
        }

        .company-name {
            margin: 0;
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
        }

        .company-address,
        .company-contact {
            margin: 2px 0 0 0;
            font-size: 10px;
            color: #475569;
        }

        .title {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            color: #0f172a;
        }

        .subtitle {
            margin: 5px 0 0 0;
            color: #475569;
            font-size: 12px;
        }

        .meta-line {
            margin-top: 10px;
            font-size: 10px;
            color: #64748b;
        }

        .chip {
            display: inline-block;
            margin-right: 6px;
            margin-bottom: 6px;
            padding: 3px 8px;
            border: 1px solid #cbd5e1;
            border-radius: 999px;
            background: #ffffff;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.2px;
            color: #334155;
        }

        .summary {
            width: 100%;
            margin-bottom: 16px;
            border-collapse: separate;
            border-spacing: 8px 0;
        }

        .summary td {
            width: 25%;
            border: 1px solid #dbe3ef;
            border-radius: 8px;
            background: #ffffff;
            padding: 8px 10px;
            vertical-align: top;
        }

        .summary-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            color: #64748b;
            margin-bottom: 3px;
        }

        .summary-value {
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
        }

        .summary-value.negative {
            color: #b91c1c;
        }

        .dealer-section {
            margin-bottom: 18px;
            page-break-inside: avoid;
            border: 1px solid #dbe3ef;
            border-radius: 8px;
            overflow: hidden;
            background: #ffffff;
        }

        .dealer-header {
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            padding: 10px 12px;
        }

        .dealer-name {
            margin: 0;
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
        }

        .dealer-details {
            margin: 4px 0 0 0;
            color: #475569;
            font-size: 10px;
        }

        .dealer-address {
            margin: 2px 0 0 0;
            color: #64748b;
            font-size: 10px;
        }

        table.invoices {
            width: 100%;
            border-collapse: collapse;
        }

        table.invoices thead th {
            background: #eff6ff;
            color: #1e3a8a;
            text-align: left;
            border-top: 1px solid #dbeafe;
            border-bottom: 1px solid #dbeafe;
            padding: 8px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.25px;
        }

        table.invoices td {
            border-bottom: 1px solid #e2e8f0;
            padding: 8px;
            vertical-align: top;
        }

        table.invoices tbody tr:nth-child(even) {
            background: #fcfdff;
        }

        .text-right {
            text-align: right;
        }

        .mono {
            font-family: DejaVu Sans Mono, monospace;
        }

        .status {
            display: inline-block;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.2px;
            padding: 2px 8px;
            border-radius: 999px;
            border: 1px solid #cbd5e1;
            color: #334155;
            background: #f8fafc;
        }

        .status.paid {
            color: #166534;
            border-color: #86efac;
            background: #f0fdf4;
        }

        .status.partial {
            color: #92400e;
            border-color: #fcd34d;
            background: #fffbeb;
        }

        .status.pending,
        .status.overdue,
        .status.unpaid {
            color: #991b1b;
            border-color: #fca5a5;
            background: #fef2f2;
        }

        .outstanding {
            color: #b91c1c;
            font-weight: 700;
        }

        .total-row {
            font-weight: 700;
            background: #f8fafc;
        }

        .no-data {
            text-align: center;
            color: #64748b;
            font-style: italic;
            padding: 12px;
        }

        .footer {
            position: fixed;
            bottom: -14px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #94a3b8;
        }
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

    <div class="report-header">
        <table class="header-company">
            <tr>
                <td class="logo-cell">
                    @if(!empty($company_logo_src))
                        <img src="{{ $company_logo_src }}" alt="Company Logo" class="company-logo">
                    @endif
                </td>
                <td>
                    <p class="company-name">{{ $company_name ?? 'ERP System' }}</p>
                    @if(!empty($company_address))
                        <p class="company-address">{{ $company_address }}</p>
                    @endif
                    <p class="company-contact">
                        @if(!empty($company_phone))
                            Tel: {{ $company_phone }}
                        @endif
                        @if(!empty($company_email))
                            @if(!empty($company_phone)) | @endif
                            {{ $company_email }}
                        @endif
                        @if(!empty($company_website))
                            @if(!empty($company_phone) || !empty($company_email)) | @endif
                            {{ $company_website }}
                        @endif
                    </p>
                </td>
            </tr>
        </table>

        <h1 class="title">Dealer Performance & Outstanding Report</h1>
        <p class="subtitle">Sales Area: <strong>{{ $area->name }}</strong></p>
        <div class="meta-line">
            <span class="chip">Generated: {{ $generated_at }}</span>
            <span class="chip">Dealers: {{ $dealers->count() }}</span>
            <span class="chip">Invoices: {{ $areaInvoiceCount }}</span>
            @if($start_date || $end_date)
                <span class="chip">Period: {{ $start_date ?? 'Beginning' }} to {{ $end_date ?? 'Today' }}</span>
            @endif
        </div>
    </div>

    <table class="summary">
        <tr>
            <td>
                <div class="summary-label">Total Sales</div>
                <div class="summary-value">Rs. {{ number_format($areaTotalSales, 2) }}</div>
            </td>
            <td>
                <div class="summary-label">Total Settled</div>
                <div class="summary-value">Rs. {{ number_format($areaTotalSettled, 2) }}</div>
            </td>
            <td>
                <div class="summary-label">Total Outstanding</div>
                <div class="summary-value {{ $areaTotalOutstanding > 0 ? 'negative' : '' }}">
                    Rs. {{ number_format($areaTotalOutstanding, 2) }}
                </div>
            </td>
            <td>
                <div class="summary-label">Collection Rate</div>
                <div class="summary-value">
                    {{ $areaTotalSales > 0 ? number_format(($areaTotalSettled / $areaTotalSales) * 100, 1) : '0.0' }}%
                </div>
            </td>
        </tr>
    </table>

    @foreach($dealers as $dealer)
        <div class="dealer-section">
            <div class="dealer-header">
                <p class="dealer-name">{{ $dealer->name }}</p>
                @php
                    $full_address = array_filter([
                        $dealer->address,
                        $dealer->address_line1,
                        $dealer->address_line2,
                        $dealer->address_line3,
                        $dealer->main_town
                    ]);
                @endphp
                <p class="dealer-address">
                    {{ !empty($full_address) ? implode(', ', $full_address) : 'No address provided' }}
                </p>
                <p class="dealer-details">Phone: {{ $dealer->phone ?? 'N/A' }} | Email: {{ $dealer->email ?? 'N/A' }}</p>
            </div>

            <table class="invoices">
                <thead>
                    <tr>
                        <th width="15%">Invoice #</th>
                        <th width="15%">Date</th>
                        <th width="15%">Status</th>
                        <th width="18%" class="text-right">Total Amount</th>
                        <th width="18%" class="text-right">Settled Amount</th>
                        <th width="18%" class="text-right">Outstanding</th>
                    </tr>
                </thead>
                <tbody>
                    @php 
                        $total_sales = 0; 
                        $total_settled = 0;
                        $total_outstanding = 0;
                    @endphp
                    
                    @forelse($dealer->invoices as $invoice)
                        @php
                            $outstanding = $invoice->total - $invoice->settle_amount;
                            $total_sales += $invoice->total;
                            $total_settled += $invoice->settle_amount;
                            $total_outstanding += $outstanding;
                            $statusClass = strtolower((string) $invoice->status);
                        @endphp
                        <tr>
                            <td class="mono">{{ $invoice->invoice_no }}</td>
                            <td>{{ \Carbon\Carbon::parse($invoice->invoice_date)->format('d M Y') }}</td>
                            <td>
                                <span class="status {{ $statusClass }}">{{ $invoice->status }}</span>
                            </td>
                            <td class="text-right">{{ number_format($invoice->total, 2) }}</td>
                            <td class="text-right">{{ number_format($invoice->settle_amount, 2) }}</td>
                            <td class="text-right {{ $outstanding > 0 ? 'outstanding' : '' }}">
                                {{ number_format($outstanding, 2) }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="no-data">No invoices found for this dealer.</td>
                        </tr>
                    @endforelse
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td colspan="3" class="text-right">Dealer Totals:</td>
                        <td class="text-right">{{ number_format($total_sales, 2) }}</td>
                        <td class="text-right">{{ number_format($total_settled, 2) }}</td>
                        <td class="text-right {{ $total_outstanding > 0 ? 'outstanding' : '' }}">
                            {{ number_format($total_outstanding, 2) }}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    @endforeach

    <div class="footer">
        Generated by ERP System | {{ $generated_at }}
    </div>
</body>
</html>