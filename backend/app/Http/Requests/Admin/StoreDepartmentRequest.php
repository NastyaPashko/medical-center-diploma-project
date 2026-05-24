<?php
namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Middleware will handle role check
    }

    public function rules(): array
    {
        $id = $this->route('department') ?: $this->route('id');
        return [
            'name' => [
                'required',
                'string',
                'max:100',
                'regex:/^(?!\s*$).+/', // not only spaces
                'unique:departments,name' . ($id ? ",$id" : ''),
            ],
            'description' => 'nullable|string|max:1000',
            'phone' => 'nullable|string|max:30',
            'floor' => 'nullable|string|max:20',
            'room_number' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'The name cannot consist only of spaces.',
        ];
    }
}
