<?php
namespace App\Services\Medical;

use App\Repositories\Medical\DepartmentRepository;
use App\Models\Department;
use Illuminate\Database\Eloquent\Collection;

class DepartmentService
{
    public function __construct(
        protected DepartmentRepository $departmentRepository
    ) {}

    public function getAllDepartments(bool $onlyActive = false): Collection
    {
        return $this->departmentRepository->getAll($onlyActive);
    }

    public function getDepartmentById(int $id): ?Department
    {
        return $this->departmentRepository->findById($id);
    }

    public function createDepartment(array $data): Department
    {
        if (!isset($data['is_active'])) {
            $data['is_active'] = true;
        }
        return $this->departmentRepository->create($data);
    }

    public function updateDepartment(int $id, array $data): Department
    {
        $department = $this->departmentRepository->findById($id);
        if (!$department) {
            throw new \Exception('Department not found');
        }

        // If deactivating department, we might want to deactivate its specializations/services too
        // But the requirement says "Prefer deactivation" over "hard delete".
        // Business rule: Cannot create specialization/service under inactive department.

        return $this->departmentRepository->update($department, $data);
    }

    public function deleteDepartment(int $id): bool
    {
        $department = $this->departmentRepository->findById($id);
        if (!$department) {
            throw new \Exception('Department not found');
        }

        // Prefer deactivation over hard delete if it has linked records
        if ($department->specializations()->count() > 0 || $department->medicalServices()->count() > 0 || $department->doctorProfiles()->count() > 0) {
            return $this->departmentRepository->update($department, ['is_active' => false])->is_active === false;
        }

        return $this->departmentRepository->delete($department);
    }
}
