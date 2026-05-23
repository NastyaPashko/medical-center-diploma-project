<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalService extends Model
{
    protected $fillable = [
        'department_id',
        'specialization_id',
        'name',
        'description',
        'price',
        'duration_minutes',
        'is_active',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function specialization()
    {
        return $this->belongsTo(Specialization::class);
    }
}
