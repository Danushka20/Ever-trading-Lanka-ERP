<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Events\EntityUpdated;

class Unit extends Model // e.g., Kg, Litre, Piece
{
    use HasFactory;

    protected $guarded = [];

    protected static function booted()
    {
        static::saved(fn($model) => event(new EntityUpdated('units', $model->id)));
        static::deleted(fn($model) => event(new EntityUpdated('units', $model->id)));
    }

    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
