<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientProfile extends Model
{
    protected $fillable = [
        'user_id',
        'date_of_birth',
        'gender',
        'address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'insurance_number',
        'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
