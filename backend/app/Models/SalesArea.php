<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Events\EntityUpdated;

class SalesArea extends Model
{
    protected $fillable = ['name', 'city'];

    protected static function booted()
    {
        static::saved(fn($model) => event(new EntityUpdated('salesAreas', $model->id)));
        static::deleted(fn($model) => event(new EntityUpdated('salesAreas', $model->id)));
    }

    public function invoices() {
        return $this->hasMany(Invoice::class);
    }

    public function dealers() {
        return $this->hasMany(Dealer::class, 'sales_area_id');
    }
}
