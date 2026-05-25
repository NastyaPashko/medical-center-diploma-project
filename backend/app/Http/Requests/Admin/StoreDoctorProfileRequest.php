<?php
namespace App\Http\Requests\Admin;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDoctorProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => [
                'required',
                'exists:users,id',
                'unique:doctor_profiles,user_id',
                Rule::exists('users', 'id')->where(function ($query) {
                    $query->where('role_id', Role::where('name', Role::DOCTOR)->first()->id);
                }),
            ],
            'department_id' => [
                'required',
                Rule::exists('departments', 'id')->where(function ($query) {
                    $query->where('is_active', true);
                }),
            ],
            'specialization_id' => [
                'required',
                Rule::exists('specializations', 'id')->where(function ($query) {
                    $query->where('is_active', true)
                        ->where('department_id', $this->department_id);
                }),
            ],
            'bio' => 'nullable|string|max:1500',
            'experience_years' => 'nullable|integer|min:0|max:60',
            'education' => 'nullable|string|max:1000',
            'office_number' => 'nullable|string|max:50',
            'consultation_price' => 'required|numeric|min:0|max:100000',
            'is_available' => 'nullable|boolean',
        ];
    }
}
