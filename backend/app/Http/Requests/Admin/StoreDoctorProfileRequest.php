<?php
namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreDoctorProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id|unique:doctor_profiles,user_id',
            'department_id' => 'required|exists:departments,id',
            'specialization_id' => 'required|exists:specializations,id',
            'bio' => 'nullable|string',
            'experience_years' => 'nullable|integer|min:0',
            'education' => 'nullable|string',
            'office_number' => 'nullable|string|max:50',
            'consultation_price' => 'required|numeric|min:0',
            'is_available' => 'nullable|boolean',
        ];
    }
}
