<?php
namespace App\Http\Resources\Medical;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MedicalServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'department_id' => $this->department_id,
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'specialization_id' => $this->specialization_id,
            'specialization' => new SpecializationResource($this->whenLoaded('specialization')),
            'name' => $this->name,
            'description' => $this->description,
            'price' => (float)$this->price,
            'duration_minutes' => (int)$this->duration_minutes,
            'is_active' => (bool)$this->is_active,
            'created_at' => $this->created_at ? $this->created_at->toISOString() : null,
            'updated_at' => $this->updated_at ? $this->updated_at->toISOString() : null,
        ];
    }
}
