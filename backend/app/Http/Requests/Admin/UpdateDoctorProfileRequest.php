<?php
namespace App\Http\Requests\Admin;

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
            'user_id' => [
                'sometimes',
                'required',
                'exists:users,id',
                Rule::unique('doctor_profiles', 'user_id')->ignore($doctorId),
            ],
            'department_id' => 'sometimes|required|exists:departments,id',
            'specialization_id' => 'sometimes|required|exists:specializations,id',
            'bio' => 'nullable|string',
            'experience_years' => 'nullable|integer|min:0',
            'education' => 'nullable|string',
            'office_number' => 'nullable|string|max:50',
            'consultation_price' => 'sometimes|required|numeric|min:0',
            'is_available' => 'nullable|boolean',
        ];
    }
}
