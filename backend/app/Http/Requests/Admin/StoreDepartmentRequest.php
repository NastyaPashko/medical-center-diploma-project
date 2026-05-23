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
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'floor' => 'nullable|string|max:50',
            'room_number' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
        ];
    }
}
