<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Events\EntityUpdated;

class InvoiceItem extends Model
{
    protected $fillable = ['invoice_id', 'item_id', 'batch_no', 'qty', 'unit_price', 'total'];

    protected static function booted()
    {
        static::saved(fn($model) => event(new EntityUpdated('invoiceItems', $model->id)));
        static::deleted(fn($model) => event(new EntityUpdated('invoiceItems', $model->id)));
    }

    public function item() {
        return $this->belongsTo(Item::class);
    }
    public function invoice() {
        return $this->belongsTo(Invoice::class);
    }
}
