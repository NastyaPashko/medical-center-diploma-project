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
        return $this->specializationRepository->create($data);
    }

    public function updateSpecialization(int $id, array $data): Specialization
    {
        $specialization = $this->specializationRepository->findById($id);
        if (!$specialization) {
            throw new \Exception('Specialization not found');
        }
        return $this->specializationRepository->update($specialization, $data);
    }

    public function deleteSpecialization(int $id): bool
    {
        $specialization = $this->specializationRepository->findById($id);
        if (!$specialization) {
            throw new \Exception('Specialization not found');
        }
        return $this->specializationRepository->delete($specialization);
    }
}
