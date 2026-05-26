<?php

namespace App\Http\Resources\Medical;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'doctor_id' => $this->doctor_id,
            'day_of_week' => $this->day_of_week,
            'start_time' => $this->formatTime($this->start_time),
            'end_time' => $this->formatTime($this->end_time),
            'slot_duration_minutes' => $this->slot_duration_minutes,
            'is_active' => (bool) $this->is_active,
            'doctor' => $this->whenLoaded('doctor', fn () => new DoctorResource($this->doctor)),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    protected function formatTime(mixed $time): ?string
    {
        if ($time === null) {
            return null;
        }

        if ($time instanceof \DateTimeInterface) {
            return $time->format('H:i');
        }

        return substr((string) $time, 0, 5);
    }
}
