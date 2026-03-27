<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    /**
     * Get the company information from settings.
     */
    public function getCompanyInfo()
    {
        $setting = Setting::first();
        
        if (!$setting) {
            return response()->json([
                'name' => '',
                'email' => '',
                'phone' => '',
                'website' => '',
                'address' => '',
                'city' => '',
                'state' => '',
                'zipCode' => '',
                'country' => '',
                'taxId' => '',
                'registrationNumber' => '',
                'logo' => null,
                'updatedAt' => null,
            ]);
        }

        return response()->json([
            'name' => $setting->company_name,
            'email' => $setting->company_email,
            'phone' => $setting->company_phone,
            'website' => $setting->company_website,
            'address' => $setting->company_address,
            'city' => $setting->company_city,
            'state' => $setting->company_state,
            'zipCode' => $setting->company_zip_code,
            'country' => $setting->company_country,
            'taxId' => $setting->company_tax_id,
            'registrationNumber' => $setting->company_registration_number,
            'logo' => $setting->company_logo_path ? asset(Storage::url($setting->company_logo_path)) : null,
            'updatedAt' => $setting->updated_at?->toIso8601String(),
        ]);
    }

    /**
     * Update the company information in settings.
     */
    public function updateCompanyInfo(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zipCode' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'taxId' => 'nullable|string|max:255',
            'registrationNumber' => 'nullable|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $setting = Setting::firstOrNew();

        $setting->fill([
            'company_name' => $request->name,
            'company_email' => $request->email,
            'company_phone' => $request->phone,
            'company_website' => $request->website,
            'company_address' => $request->address,
            'company_city' => $request->city,
            'company_state' => $request->state,
            'company_zip_code' => $request->zipCode,
            'company_country' => $request->country,
            'company_tax_id' => $request->taxId,
            'company_registration_number' => $request->registrationNumber,
        ]);

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($setting->company_logo_path) {
                Storage::disk('public')->delete($setting->company_logo_path);
            }
            // Store in the 'public' disk explicitly
            $path = $request->file('logo')->store('company', 'public');
            $setting->company_logo_path = $path;
        }

        $setting->save();

        return response()->json([
            'message' => 'Company profile updated successfully',
            'data' => $this->getCompanyInfo()->original,
            'timestamp' => $setting->updated_at?->toIso8601String(),
        ]);
    }

    /**
     * Get app preferences.
     */
    public function getPreferences()
    {
        $setting = Setting::first();
        
        if (!$setting) {
            return response()->json([
                'language' => 'en',
                'timezone' => 'UTC',
                'currency' => 'LKR',
                'theme' => 'system',
                'dateFormat' => 'YYYY-MM-DD',
                'rowsPerPage' => 10,
            ]);
        }

        return response()->json([
            'language' => $setting->language ?? 'en',
            'timezone' => $setting->timezone ?? 'UTC',
            'currency' => $setting->currency ?? 'LKR',
            'theme' => $setting->theme ?? 'system',
            'dateFormat' => $setting->date_format ?? 'YYYY-MM-DD',
            'rowsPerPage' => (int)($setting->rows_per_page ?? 10),
        ]);
    }

    /**
     * Update app preferences.
     */
    public function updatePreferences(Request $request)
    {
        $request->validate([
            'language' => 'nullable|string',
            'timezone' => 'nullable|string',
            'currency' => 'nullable|string',
            'theme' => 'nullable|string',
            'dateFormat' => 'nullable|string',
            'rowsPerPage' => 'nullable|integer',
        ]);

        $setting = Setting::firstOrNew();

        if ($request->has('language')) $setting->language = $request->language;
        if ($request->has('timezone')) $setting->timezone = $request->timezone;
        if ($request->has('currency')) $setting->currency = $request->currency;
        if ($request->has('theme')) $setting->theme = $request->theme;
        if ($request->has('dateFormat')) $setting->date_format = $request->dateFormat;
        if ($request->has('rowsPerPage')) $setting->rows_per_page = $request->rowsPerPage;

        $setting->save();

        return response()->json([
            'message' => 'Preferences updated successfully',
            'data' => $this->getPreferences()->original
        ]);
    }

    /**
     * Get the company logo as a file with CORS headers.
     * Supports PNG, JPG, JPEG, GIF, WebP formats.
     */
    public function getLogo()
    {
        $setting = Setting::first();
        
        if (!$setting || !$setting->company_logo_path) {
            return response()->json(['message' => 'Logo not found'], 404);
        }

        if (!Storage::disk('public')->exists($setting->company_logo_path)) {
            return response()->json(['message' => 'Logo file not found'], 404);
        }

        try {
            $file = Storage::disk('public')->get($setting->company_logo_path);
            $mimeType = Storage::disk('public')->mimeType($setting->company_logo_path);
            
            // Fallback MIME type detection based on file extension
            if (!$mimeType) {
                $extension = pathinfo($setting->company_logo_path, PATHINFO_EXTENSION);
                $mimeTypes = [
                    'png' => 'image/png',
                    'jpg' => 'image/jpeg',
                    'jpeg' => 'image/jpeg',
                    'gif' => 'image/gif',
                    'webp' => 'image/webp',
                ];
                $mimeType = $mimeTypes[strtolower($extension)] ?? 'image/png';
            }
            
            // Return the file as a response with proper CORS headers
            return response($file, 200)
                ->header('Content-Type', $mimeType)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
                ->header('Cache-Control', 'public, max-age=86400')
                ->header('Content-Disposition', 'inline; filename="company-logo.' . pathinfo($setting->company_logo_path, PATHINFO_EXTENSION) . '"');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error retrieving logo: ' . $e->getMessage()], 500);
        }
    }
}
