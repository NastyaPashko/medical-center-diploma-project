<?php
namespace App\Services\Medical;

use App\Repositories\Medical\SpecializationRepository;
use App\Models\Specialization;
use Illuminate\Database\Eloquent\Collection;

class SpecializationService
{
    public function __construct(
        protected SpecializationRepository $specializationRepository
    ) {}

    public function getAllSpecializations(array $filters = [], bool $onlyActive = false): Collection
    {
        return $this->specializationRepository->getAll($filters, $onlyActive);
    }

    public function getSpecializationById(int $id): ?Specialization
    {
        return $this->specializationRepository->findById($id);
    }

    public function createSpecialization(array $data): Specialization
    {
        $department = \App\Models\Department::find($data['department_id']);
        if (!$department || !$department->is_active) {
            throw new \Exception('Cannot create specialization under inactive or non-existent department');
        }

        if (!isset($data['is_active'])) {
            $data['is_active'] = true;
        }

        return $this->specializationRepository->create($data);
    }

    public function updateSpecialization(int $id, array $data): Specialization
    {
        $specialization = $this->specializationRepository->findById($id);
        if (!$specialization) {
            throw new \Exception('Specialization not found');
        }

        if (isset($data['department_id']) && $data['department_id'] != $specialization->department_id) {
            $department = \App\Models\Department::find($data['department_id']);
            if (!$department || !$department->is_active) {
                throw new \Exception('Cannot move specialization to inactive or non-existent department');
            }
        }

        return $this->specializationRepository->update($specialization, $data);
    }

    public function deleteSpecialization(int $id): bool
    {
        $specialization = $this->specializationRepository->findById($id);
        if (!$specialization) {
            throw new \Exception('Specialization not found');
        }

        // Prefer deactivation if linked to services or doctors
        if ($specialization->medicalServices()->count() > 0 || $specialization->doctorProfiles()->count() > 0) {
            return $this->specializationRepository->update($specialization, ['is_active' => false])->is_active === false;
        }

        return $this->specializationRepository->delete($specialization);
    }
}
