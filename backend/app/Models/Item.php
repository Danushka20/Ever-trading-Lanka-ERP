<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Events\EntityUpdated;

class Item extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected static function booted()
    {
        static::saved(fn($model) => event(new EntityUpdated('items', $model->id)));
        static::deleted(fn($model) => event(new EntityUpdated('items', $model->id)));
    }

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    // A critical relationship for FIFO
    public function batches()
    {
        return $this->hasMany(ItemBatch::class);
    }

    // Helper to get total stock
    // public function getTotalStockAttribute()
    // {
    //     return $this->batches()->sum('remaining_quantity');
    // }
}
