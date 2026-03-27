<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationSetting extends Model
{
    protected $fillable = [
        'user_id',
        'invoiceCreated',
        'paymentReceived',
        'lowStock',
        'orderStatusChanged',
    ];

    protected $casts = [
        'invoiceCreated' => 'boolean',
        'paymentReceived' => 'boolean',
        'lowStock' => 'boolean',
        'orderStatusChanged' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
