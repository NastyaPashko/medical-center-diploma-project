<?php
namespace App\Services\Medical;

use App\Repositories\Medical\DoctorProfileRepository;
use App\Models\DoctorProfile;
use Illuminate\Database\Eloquent\Collection;

class DoctorService
{
    public function __construct(
        protected DoctorProfileRepository $doctorProfileRepository
    ) {}

    public function getAllDoctors(array $filters = [], bool $onlyAvailable = false): Collection
    {
        return $this->doctorProfileRepository->getAll($filters, $onlyAvailable);
    }

    public function getDoctorById(int $id): ?DoctorProfile
    {
        return $this->doctorProfileRepository->findById($id);
    }

    public function createDoctor(array $data): DoctorProfile
    {
        return $this->doctorProfileRepository->create($data);
    }

    public function updateDoctor(int $id, array $data): DoctorProfile
    {
        $profile = $this->doctorProfileRepository->findById($id);
        if (!$profile) {
            throw new \Exception('Doctor not found');
        }
        return $this->doctorProfileRepository->update($profile, $data);
    }

    public function deleteDoctor(int $id): bool
    {
        $profile = $this->doctorProfileRepository->findById($id);
        if (!$profile) {
            throw new \Exception('Doctor not found');
        }
        return $this->doctorProfileRepository->delete($profile);
    }
}
