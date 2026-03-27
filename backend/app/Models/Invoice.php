<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Events\EntityUpdated;

class Invoice extends Model
{
    protected $fillable = ['invoice_no', 'user_id', 'sales_area_id', 'customer_name', 'status', 'sub_total', 'discount', 'total', 'settle_amount', 'invoice_date', 'due_date', 'notes', 'dealer_id'];

    protected static function booted()
    {
        static::saved(fn($model) => event(new EntityUpdated($model->getTable(), $model->id)));
        static::deleted(fn($model) => event(new EntityUpdated($model->getTable(), $model->id)));
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
    public function dealer() {
        return $this->belongsTo(Dealer::class);
    }
    public function salesArea() {
        return $this->belongsTo(SalesArea::class);
    }
    public function items() {
        return $this->hasMany(InvoiceItem::class);
    }
}
