<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Events\EntityUpdated;

class ItemBatch extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected static function booted()
    {
        static::saved(fn($model) => event(new EntityUpdated('stockBatches', $model->id)));
        static::deleted(fn($model) => event(new EntityUpdated('stockBatches', $model->id)));
    }

    protected $casts = [
        'expiry_date' => 'date',
        'received_date' => 'datetime',
        'quantity' => 'decimal:2',
        'remaining_quantity' => 'decimal:2',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function purchaseSource()
    {
        return $this->belongsTo(PurchaseOrderItem::class, 'purchase_order_item_id');
    }

    public function allocations()
    {
        return $this->hasMany(BatchAllocation::class);
    }

    /**
     * Scope to get batches in FIFO order
     */
    public function scopeFifo($query)
    {
        return $query->where('remaining_quantity', '>', 0)
                     ->orderBy('received_date', 'asc')
                     ->orderBy('id', 'asc');
    }
}
