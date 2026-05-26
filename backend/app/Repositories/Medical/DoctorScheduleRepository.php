<?php
namespace App\Repositories\Medical;

use App\Models\DoctorSchedule;
use Illuminate\Database\Eloquent\Collection;

class DoctorScheduleRepository
{
    public function getAll(array $filters = []): Collection
    {
        $query = DoctorSchedule::query()->with('doctorProfile.user');

        if (!empty($filters['doctor_profile_id'])) {
            $query->where('doctor_profile_id', $filters['doctor_profile_id']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        return $query->get();
    }

    public function findById(int $id): ?DoctorSchedule
    {
        return DoctorSchedule::with('doctorProfile.user')->find($id);
    }

    public function create(array $data): DoctorSchedule
    {
        return DoctorSchedule::create($data);
    }

    public function update(DoctorSchedule $schedule, array $data): DoctorSchedule
    {
        $schedule->update($data);
        return $schedule;
    }

    public function delete(DoctorSchedule $schedule): bool
    {
        return $schedule->delete();
    }

    public function getByDoctorProfileId(int $doctorProfileId): Collection
    {
        return DoctorSchedule::where('doctor_profile_id', $doctorProfileId)->get();
    }

    public function hasOverlappingSchedule(int $doctorProfileId, int $dayOfWeek, string $startTime, string $endTime, ?int $excludeId = null): bool
    {
        $query = DoctorSchedule::where('doctor_profile_id', $doctorProfileId)
            ->where('day_of_week', $dayOfWeek)
            ->where(function ($q) use ($startTime, $endTime) {
                $q->where(function ($inner) use ($startTime, $endTime) {
                    $inner->where('start_time', '<', $endTime)
                        ->where('end_time', '>', $startTime);
                });
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
}
