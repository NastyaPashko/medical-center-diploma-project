<?php
namespace App\Http\Requests\Medical;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDoctorProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:30',
            'bio' => 'nullable|string|max:2000',
            'experience_years' => 'nullable|integer|min:0|max:60',
            'education' => 'nullable|string|max:500',
            'office_number' => 'nullable|string|max:50',
            'consultation_price' => 'nullable|numeric|min:0',
            'is_available' => 'nullable|boolean',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ];
    }
}
