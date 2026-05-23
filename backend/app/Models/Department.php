<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = [
        'name',
        'description',
        'phone',
        'floor',
        'room_number',
        'is_active',
    ];

    public function specializations()
    {
        return $this->hasMany(Specialization::class);
    }

    public function medicalServices()
    {
        return $this->hasMany(MedicalService::class);
    }

    public function doctorProfiles()
    {
        return $this->hasMany(DoctorProfile::class);
    }
}
