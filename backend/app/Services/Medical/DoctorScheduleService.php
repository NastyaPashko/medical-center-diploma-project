<?php

namespace App\Services\Medical;

use App\Models\DoctorSchedule;
use App\Repositories\Medical\DoctorProfileRepository;
use App\Repositories\Medical\DoctorScheduleRepository;
use Illuminate\Database\Eloquent\Collection;

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

    public function getSchedulesForDoctorProfile(int $doctorProfileId, bool $onlyActive = false): Collection
    {
        return $this->doctorScheduleRepository->getByDoctorId($doctorProfileId, $onlyActive);
    }

    public function getSchedulesForUserId(int $userId, bool $onlyActive = false): ?Collection
    {
        $profile = $this->doctorProfileRepository->findByUserId($userId);
        if (!$profile) {
            return null;
        }

        return $this->doctorScheduleRepository->getByDoctorId($profile->id, $onlyActive);
    }

    public function createSchedule(array $data): DoctorSchedule
    {
        $this->assertDoctorExists($data['doctor_id']);
        $this->assertValidTimeRange($data['start_time'], $data['end_time']);

        if (!isset($data['is_active'])) {
            $data['is_active'] = true;
        }

        $schedule = $this->doctorScheduleRepository->create($data);

        return $schedule->load('doctor.user');
    }

    public function updateSchedule(int $id, array $data): DoctorSchedule
    {
        $schedule = $this->doctorScheduleRepository->findById($id);
        if (!$schedule) {
            throw new \Exception('Schedule not found');
        }

        if (isset($data['doctor_id'])) {
            $this->assertDoctorExists($data['doctor_id']);
        }

        $startTime = $data['start_time'] ?? $schedule->start_time;
        $endTime = $data['end_time'] ?? $schedule->end_time;
        $this->assertValidTimeRange(
            is_string($startTime) ? $startTime : $startTime->format('H:i'),
            is_string($endTime) ? $endTime : $endTime->format('H:i')
        );

        $schedule = $this->doctorScheduleRepository->update($schedule, $data);

        return $schedule->load('doctor.user');
    }

    public function deleteSchedule(int $id): bool
    {
        $schedule = $this->doctorScheduleRepository->findById($id);
        if (!$schedule) {
            throw new \Exception('Schedule not found');
        }

        return $this->doctorScheduleRepository->delete($schedule);
    }

    protected function assertDoctorExists(int $doctorId): void
    {
        if (!$this->doctorProfileRepository->findById($doctorId)) {
            throw new \Exception('Doctor not found');
        }
    }

    protected function assertValidTimeRange(string $startTime, string $endTime): void
    {
        if (strtotime($endTime) <= strtotime($startTime)) {
            throw new \Exception('End time must be after start time');
        }
    }
}
