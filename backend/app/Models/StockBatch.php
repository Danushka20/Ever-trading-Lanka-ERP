<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockBatch extends Model
{
    protected $fillable = ['product_id', 'batch_no', 'qty', 'cost_price'];

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
