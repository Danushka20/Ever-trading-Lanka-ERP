<?php

namespace App\Http\Controllers;

use App\Models\SalesArea;
use App\Models\Dealer;
use App\Models\Invoice;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Barryvdh\Snappy\Facades\SnappyPdf as Pdf;
use Barryvdh\DomPDF\Facade\Pdf as DomPdf;
use Throwable;

class SalesAreaReportController extends Controller
{
    /**
     * Generate Dealer Performance & Outstanding PDF for an Area
     */
    public function dealerPerformancePdf(Request $request, $areaId)
    {
        $area = SalesArea::findOrFail($areaId);
        
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Get all dealers in this area with their invoices
        $dealers = Dealer::where('sales_area_id', $areaId)
            ->with(['invoices' => function($query) use ($startDate, $endDate) {
                if ($startDate) {
                    $query->whereDate('invoice_date', '>=', $startDate);
                }
                if ($endDate) {
                    $query->whereDate('invoice_date', '<=', $endDate);
                }
                $query->orderBy('invoice_date', 'desc');
            }])
            ->get();

        $setting = Setting::first();
        $companyAddressParts = array_filter([
            $setting?->company_address,
            $setting?->company_city,
            $setting?->company_state,
            $setting?->company_zip_code,
            $setting?->company_country,
        ]);

        $companyLogoSrc = null;
        if ($setting?->company_logo_path && Storage::disk('public')->exists($setting->company_logo_path)) {
            $logoExtension = strtolower((string) pathinfo($setting->company_logo_path, PATHINFO_EXTENSION));
            $isGdAvailable = extension_loaded('gd');

            if (in_array($logoExtension, ['jpg', 'jpeg', 'png', 'gif', 'webp'], true)) {
                $companyLogoSrc = storage_path('app/public/' . $setting->company_logo_path);
            } elseif ($logoExtension === 'svg' && $isGdAvailable) {
                $companyLogoSrc = storage_path('app/public/' . $setting->company_logo_path);
            }
        }

        $data = [
            'area' => $area,
            'dealers' => $dealers,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'company_name' => $setting?->company_name ?: 'ERP System',
            'company_address' => !empty($companyAddressParts) ? implode(', ', $companyAddressParts) : null,
            'company_phone' => $setting?->company_phone,
            'company_email' => $setting?->company_email,
            'company_website' => $setting?->company_website,
            'company_logo_src' => $companyLogoSrc,
            'generated_at' => now()->format('Y-m-d H:i:s'),
        ];

        try {
            $domPdfData = $data;
            Log::info('Generating dealer performance report with DomPDF', [
                'area_id' => $areaId,
                'view' => 'reports.area-dealer-performance-dompdf',
                'logo_included' => !empty($domPdfData['company_logo_src']),
            ]);

            $pdf = DomPdf::loadView('reports.area-dealer-performance-dompdf', $domPdfData)
                ->setPaper('a4', 'portrait');

            return $pdf->download("Area-{$area->name}-Report.pdf");
        } catch (Throwable $domPdfError) {
            $domPdfErrorMessage = $domPdfError->getMessage();
            $canRetryWithoutLogo = !empty($data['company_logo_src'])
                && str_contains(strtolower($domPdfErrorMessage), 'gd extension');

            if ($canRetryWithoutLogo) {
                try {
                    $domPdfDataWithoutLogo = $data;
                    $domPdfDataWithoutLogo['company_logo_src'] = null;

                    Log::warning('DomPDF failed with logo; retrying without logo', [
                        'area_id' => $areaId,
                        'start_date' => $startDate,
                        'end_date' => $endDate,
                        'error' => $domPdfErrorMessage,
                    ]);

                    $pdf = DomPdf::loadView('reports.area-dealer-performance-dompdf', $domPdfDataWithoutLogo)
                        ->setPaper('a4', 'portrait');

                    return $pdf->download("Area-{$area->name}-Report.pdf");
                } catch (Throwable $domPdfRetryError) {
                    $domPdfError = $domPdfRetryError;
                    $domPdfErrorMessage = $domPdfRetryError->getMessage();
                }
            }

            Log::warning('DomPDF generation failed; falling back to Snappy', [
                'area_id' => $areaId,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'error' => $domPdfErrorMessage,
            ]);

            try {
                $pdf = Pdf::loadView('reports.area-dealer-performance', $data);

                return $pdf->download("Area-{$area->name}-Report.pdf");
            } catch (Throwable $snappyError) {
                Log::error('Dealer performance PDF generation failed for both DomPDF and Snappy', [
                    'area_id' => $areaId,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'dompdf_error' => $domPdfErrorMessage,
                    'snappy_error' => $snappyError->getMessage(),
                ]);

                return response()->json([
                    'message' => 'PDF generation failed. Please contact support.',
                ], 500);
            }
        }
    }
}
