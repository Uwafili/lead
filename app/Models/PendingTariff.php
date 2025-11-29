<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendingTariff extends Model
{
    
     protected $fillable=[
        'user_id',
        'user_name'
    ];


public function user()
{
    return $this->belongsTo(User::class); // tariff belongs to a user
}
}
