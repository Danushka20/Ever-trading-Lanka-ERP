<?php

namespace App\Http\Controllers;

use App\Models\NotificationSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationSettingController extends Controller
{
    /**
     * Get notification settings for the current user.
     */
    public function index()
    {
        $settings = NotificationSetting::firstOrCreate(
            ['user_id' => Auth::id()],
            [
                'invoiceCreated' => true,
                'paymentReceived' => true,
                'lowStock' => true,
                'orderStatusChanged' => true,
            ]
        );

        return response()->json($settings);
    }

    /**
     * Update notification settings for the current user.
     */
    public function update(Request $request)
    {
        $request->validate([
            'invoiceCreated' => 'nullable|boolean',
            'paymentReceived' => 'nullable|boolean',
            'lowStock' => 'nullable|boolean',
            'orderStatusChanged' => 'nullable|boolean',
        ]);

        $settings = NotificationSetting::updateOrCreate(
            ['user_id' => Auth::id()],
            $request->only(['invoiceCreated', 'paymentReceived', 'lowStock', 'orderStatusChanged'])
        );

        return response()->json([
            'message' => 'Notification settings updated successfully',
            'data' => $settings
        ]);
    }
}
