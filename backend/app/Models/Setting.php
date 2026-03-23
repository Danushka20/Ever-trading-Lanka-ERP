<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    /** @use HasFactory<\Database\Factories\SettingFactory> */
    use HasFactory;

    protected $fillable = [
        'company_name',
        'company_email',
        'company_phone',
        'company_website',
        'company_address',
        'company_city',
        'company_state',
        'company_zip_code',
        'company_country',
        'company_tax_id',
        'company_registration_number',
        'company_logo_path',
    ];
}
