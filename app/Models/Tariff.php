<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tariff extends Model
{
     protected $fillable=[
        'user_id',
        'TARIFF',
        'SERVICE',
        'Edited_Service',
        'Edited_Tariff',
        'Negotiated'
    ];
}
