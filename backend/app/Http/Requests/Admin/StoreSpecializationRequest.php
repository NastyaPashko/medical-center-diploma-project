<?php
namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Validation\Rule;

class StoreSpecializationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('specialization') ?: $this->route('id');
        return [
            'department_id' => 'required|exists:departments,id',
            'name' => [
                'required',
                'string',
                'max:100',
                'regex:/^(?!\s*$).+/', // not only spaces
                Rule::unique('specializations')->where(fn ($query) =>
                    $query->where('department_id', $this->department_id)
                )->ignore($id),
            ],
            'description' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'The name cannot consist only of spaces.',
            'name.unique' => 'The specialization name must be unique within the department.',
        ];
    }
}
