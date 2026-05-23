<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Specialization extends Model
{
    protected $fillable = [
        'department_id',
        'name',
        'description',
        'is_active',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
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
