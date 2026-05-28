<?php
namespace App\Services\Medical;

use App\Models\DoctorSchedule;
use App\Repositories\Medical\DoctorScheduleRepository;
use App\Repositories\Medical\DoctorProfileRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class DoctorScheduleService
{
    public function __construct(
        protected DoctorScheduleRepository $doctorScheduleRepository,
        protected DoctorProfileRepository $doctorProfileRepository
    ) {}

    public function getAllSchedules(array $filters = []): Collection
    {
        return $this->doctorScheduleRepository->getAll($filters);
    }

    public function getScheduleById(int $id): ?DoctorSchedule
    {
        return $this->doctorScheduleRepository->findById($id);
    }

    public function createSchedule(array $data): DoctorSchedule
    {
        $this->validateBusinessRules($data);
        return $this->doctorScheduleRepository->create($data);
    }

    public function updateSchedule(int $id, array $data): DoctorSchedule
    {
        $schedule = $this->doctorScheduleRepository->findById($id);
        if (!$schedule) {
            throw new \Exception('Schedule not found');
        }

        $mergedData = array_merge($schedule->toArray(), $data);
        $this->validateBusinessRules($mergedData, $id);
        return $this->doctorScheduleRepository->update($schedule, $data);
    }

    protected function validateBusinessRules(array $data, ?int $excludeId = null): void
    {
        $doctor = $this->doctorProfileRepository->findById($data['doctor_profile_id']);

        if (!$doctor) {
            throw ValidationException::withMessages([
                'doctor_profile_id' => ['Doctor profile not found.'],
            ]);
        }

        if (($data['is_active'] ?? false) && !$doctor->is_available) {
            throw ValidationException::withMessages([
                'doctor_profile_id' => ['Cannot create active schedule for unavailable doctor.'],
            ]);
        }

        if ($this->doctorScheduleRepository->hasOverlappingSchedule(
            $data['doctor_profile_id'],
            $data['day_of_week'],
            $data['start_time'],
            $data['end_time'],
            $excludeId
        )) {
            throw ValidationException::withMessages([
                'start_time' => ['This schedule overlaps with an existing schedule for this doctor and day.'],
            ]);
        }
    }

    public function deleteSchedule(int $id): bool
    {
        $schedule = $this->doctorScheduleRepository->findById($id);
        if (!$schedule) {
            throw new \Exception('Schedule not found');
        }
        return $this->doctorScheduleRepository->delete($schedule);
    }

    public function getDoctorSchedules(int $doctorProfileId): Collection
    {
        return $this->doctorScheduleRepository->getByDoctorProfileId($doctorProfileId);
    }
}
