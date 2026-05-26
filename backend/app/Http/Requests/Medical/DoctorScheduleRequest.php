<?php

namespace App\Http\Requests\Medical;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DoctorScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'doctor_profile_id' => 'required|exists:doctor_profiles,id',
            'day_of_week' => 'required|integer|min:1|max:7',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'slot_duration_minutes' => [
                'required',
                'integer',
                'min:10',
                'max:120',
                function ($attribute, $value, $fail) {
                    if ($value % 5 !== 0) {
                        $fail('The ' . $attribute . ' must be divisible by 5.');
                    }
                },
            ],
            'is_active' => 'boolean',
        ];
    }
}
