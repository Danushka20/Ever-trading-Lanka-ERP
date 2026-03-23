<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Events\EntityUpdated;

class Product extends Model
{
    protected $fillable = ['name', 'unit_price'];

    protected static function booted()
    {
        static::saved(fn($model) => event(new EntityUpdated('products', $model->id)));
        static::deleted(fn($model) => event(new EntityUpdated('products', $model->id)));
    }

    public function batches() {
        return $this->hasMany(StockBatch::class);
    }
}
