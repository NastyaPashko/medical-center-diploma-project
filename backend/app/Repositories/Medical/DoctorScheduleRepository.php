<?php

namespace App\Repositories\Medical;

use App\Models\DoctorSchedule;
use Illuminate\Database\Eloquent\Collection;

class DoctorScheduleRepository
{
    public function getAll(array $filters = []): Collection
    {
        $query = DoctorSchedule::query()->with('doctor.user');

        if (!empty($filters['doctor_id'])) {
            $query->where('doctor_id', $filters['doctor_id']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['day_of_week'])) {
            $query->where('day_of_week', $filters['day_of_week']);
        }

        return $query->orderBy('doctor_id')
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();
    }

    public function getByDoctorId(int $doctorId, bool $onlyActive = false): Collection
    {
        $query = DoctorSchedule::query()
            ->where('doctor_id', $doctorId)
            ->orderBy('day_of_week')
            ->orderBy('start_time');

        if ($onlyActive) {
            $query->where('is_active', true);
        }

        return $query->get();
    }

    public function findById(int $id): ?DoctorSchedule
    {
        return DoctorSchedule::with('doctor.user')->find($id);
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
}
