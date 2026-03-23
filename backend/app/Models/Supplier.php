<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Events\EntityUpdated;

class Supplier extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected static function booted()
    {
        static::saved(fn($model) => event(new EntityUpdated('suppliers', $model->id)));
        static::deleted(fn($model) => event(new EntityUpdated('suppliers', $model->id)));
    }

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }
}
