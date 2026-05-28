<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    //

    protected $fillable = [
        'patient_profile_id',
        'doctor_profile_id',
        'medical_service_id',
        'appointment_date',
        'appointment_time',
        'status',
        'notes',
    ];

    public function patient()
    {
        return $this->belongsTo(PatientProfile::class, 'patient_profile_id');
    }

    public function doctor()
    {
        return $this->belongsTo(DoctorProfile::class, 'doctor_profile_id');
    }

    public function service()
    {
        return $this->belongsTo(MedicalService::class, 'medical_service_id');
    }
}
