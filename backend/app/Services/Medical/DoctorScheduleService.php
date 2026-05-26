<?php
namespace App\Services\Medical;

use App\Models\DoctorSchedule;
use App\Repositories\Medical\DoctorScheduleRepository;
use Illuminate\Database\Eloquent\Collection;

class DoctorScheduleService
{
    public function __construct(
        protected DoctorScheduleRepository $doctorScheduleRepository
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
        return $this->doctorScheduleRepository->create($data);
    }

    public function updateSchedule(int $id, array $data): DoctorSchedule
    {
        $schedule = $this->doctorScheduleRepository->findById($id);
        if (!$schedule) {
            throw new \Exception('Schedule not found');
        }
        return $this->doctorScheduleRepository->update($schedule, $data);
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
