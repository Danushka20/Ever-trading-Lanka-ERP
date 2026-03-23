<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Events\EntityUpdated;

class SalesTarget extends Model
{
    protected $fillable = ['user_id', 'month', 'year', 'target_amount', 'achieved_amount'];

    protected static function booted()
    {
        static::saved(fn($model) => event(new EntityUpdated($model->getTable(), $model->id)));
        static::deleted(fn($model) => event(new EntityUpdated($model->getTable(), $model->id)));
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
