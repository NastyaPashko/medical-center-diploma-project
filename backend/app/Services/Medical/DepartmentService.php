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
        return $this->departmentRepository->create($data);
    }

    public function updateDepartment(int $id, array $data): Department
    {
        $department = $this->departmentRepository->findById($id);
        if (!$department) {
            throw new \Exception('Department not found');
        }
        return $this->departmentRepository->update($department, $data);
    }

    public function deleteDepartment(int $id): bool
    {
        $department = $this->departmentRepository->findById($id);
        if (!$department) {
            throw new \Exception('Department not found');
        }
        return $this->departmentRepository->delete($department);
    }
}
