<?php
namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Validation\Rule;

class StoreMedicalServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('service') ?: $this->route('id');
        return [
            'department_id' => 'required|exists:departments,id',
            'specialization_id' => [
                'required',
                'exists:specializations,id',
            ],
            'name' => [
                'required',
                'string',
                'max:150',
                'regex:/^(?!\s*$).+/', // not only spaces
                Rule::unique('medical_services')->where(fn ($query) =>
                    $query->where('department_id', $this->department_id)
                          ->where('specialization_id', $this->specialization_id)
                )->ignore($id),
            ],
            'description' => 'nullable|string|max:1500',
            'price' => 'required|numeric|min:0|max:100000',
            'duration_minutes' => [
                'required',
                'integer',
                'min:5',
                'max:240',
                function ($attribute, $value, $fail) {
                    if ($value % 5 !== 0) {
                        $fail('The duration must be divisible by 5.');
                    }
                },
            ],
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'The name cannot consist only of spaces.',
            'name.unique' => 'The service name must be unique within the same department and specialization.',
        ];
    }
}
