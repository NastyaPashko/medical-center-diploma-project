<?php
namespace App\Http\Requests\Admin;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDoctorProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $doctorId = $this->route('doctor');

        return [
            'department_id' => [
                'sometimes',
                'required',
                Rule::exists('departments', 'id')->where(function ($query) {
                    $query->where('is_active', true);
                }),
            ],
            'specialization_id' => [
                'sometimes',
                'required',
                Rule::exists('specializations', 'id')->where(function ($query) {
                    $query->where('is_active', true)
                        ->where('department_id', $this->department_id ?? $this->getCurrentDepartmentId());
                }),
            ],
            'bio' => 'nullable|string|max:1500',
            'experience_years' => 'nullable|integer|min:0|max:60',
            'education' => 'nullable|string|max:1000',
            'office_number' => 'nullable|string|max:50',
            'consultation_price' => 'sometimes|required|numeric|min:0|max:100000',
            'is_available' => 'nullable|boolean',
        ];
    }

    protected function getCurrentDepartmentId()
    {
        $doctorId = $this->route('doctor');
        $profile = \App\Models\DoctorProfile::find($doctorId);
        return $profile ? $profile->department_id : null;
    }
}
