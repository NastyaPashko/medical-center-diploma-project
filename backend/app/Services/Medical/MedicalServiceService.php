<?php
namespace App\Services\Medical;

use App\Repositories\Medical\MedicalServiceRepository;
use App\Models\MedicalService;
use Illuminate\Database\Eloquent\Collection;

class MedicalServiceService
{
    public function __construct(
        protected MedicalServiceRepository $medicalServiceRepository
    ) {}

    public function getAllServices(array $filters = [], bool $onlyActive = false): Collection
    {
        return $this->medicalServiceRepository->getAll($filters, $onlyActive);
    }

    public function getServiceById(int $id): ?MedicalService
    {
        return $this->medicalServiceRepository->findById($id);
    }

    public function createService(array $data): MedicalService
    {
        $department = \App\Models\Department::find($data['department_id']);
        if (!$department || !$department->is_active) {
            throw new \Exception('Cannot create service under inactive or non-existent department');
        }

        $specialization = \App\Models\Specialization::find($data['specialization_id']);
        if (!$specialization || !$specialization->is_active) {
            throw new \Exception('Cannot create service under inactive or non-existent specialization');
        }

        if ($specialization->department_id != $data['department_id']) {
            throw new \Exception('Specialization must belong to the selected department');
        }

        if (!isset($data['is_active'])) {
            $data['is_active'] = true;
        }

        return $this->medicalServiceRepository->create($data);
    }

    public function updateService(int $id, array $data): MedicalService
    {
        $service = $this->medicalServiceRepository->findById($id);
        if (!$service) {
            throw new \Exception('Service not found');
        }

        $deptId = $data['department_id'] ?? $service->department_id;
        $specId = $data['specialization_id'] ?? $service->specialization_id;

        if (isset($data['department_id']) && $data['department_id'] != $service->department_id) {
            $department = \App\Models\Department::find($data['department_id']);
            if (!$department || !$department->is_active) {
                throw new \Exception('Cannot move service to inactive or non-existent department');
            }
        }

        if (isset($data['specialization_id']) && $data['specialization_id'] != $service->specialization_id) {
            $specialization = \App\Models\Specialization::find($data['specialization_id']);
            if (!$specialization || !$specialization->is_active) {
                throw new \Exception('Cannot move service to inactive or non-existent specialization');
            }
        }

        // Check linkage if either department or specialization changed
        if (isset($data['department_id']) || isset($data['specialization_id'])) {
            $specialization = \App\Models\Specialization::find($specId);
            if ($specialization && $specialization->department_id != $deptId) {
                throw new \Exception('Specialization must belong to the selected department');
            }
        }

        return $this->medicalServiceRepository->update($service, $data);
    }

    public function deleteService(int $id): bool
    {
        $service = $this->medicalServiceRepository->findById($id);
        if (!$service) {
            throw new \Exception('Service not found');
        }

        // Deactivate instead of hard delete (always prefer deactivation for medical services if they might have been used in appointments)
        // Since we don't have appointments table yet, we can check if it's "linked" to anything else if needed,
        // but the prompt says "Prefer deactivation".
        return $this->medicalServiceRepository->update($service, ['is_active' => false])->is_active === false;
    }
}
