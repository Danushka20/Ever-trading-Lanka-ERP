<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Events\EntityUpdated;

class PurchaseOrderItem extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected static function booted()
    {
        static::saved(fn($model) => event(new EntityUpdated('purchaseOrderItems', $model->id)));
        static::deleted(fn($model) => event(new EntityUpdated('purchaseOrderItems', $model->id)));
    }

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    // The batch that was created from receiving this item
    public function generatedBatch()
    {
        return $this->hasOne(ItemBatch::class, 'purchase_order_item_id');
    }
}
