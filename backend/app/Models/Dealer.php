<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Events\EntityUpdated;

class Dealer extends Model
{
    use HasFactory;

    protected $table = 'dealers';
    protected $guarded = [];

    protected $casts = [
        'credit_limit' => 'decimal:2',
        'percentage' => 'decimal:2',
        'is_active' => 'boolean',
        'sales_area_id' => 'integer',
        'salesperson_id' => 'integer',
    ];

    protected static function booted()
    {
        static::saved(fn($model) => event(new EntityUpdated('dealers', $model->id)));
        static::deleted(fn($model) => event(new EntityUpdated('dealers', $model->id)));
    }

    public function salesPerson()
    {
        return $this->belongsTo(User::class, 'salesperson_id');
    }

    public function salesArea()
    {
        return $this->belongsTo(SalesArea::class, 'sales_area_id');
    }

    // Optionally calculate balance from transactions, but for now using the cached field for simplicity
    public function salesOrders()
    {
        return $this->hasMany(SalesOrder::class, 'dealer_id');
    }
}
