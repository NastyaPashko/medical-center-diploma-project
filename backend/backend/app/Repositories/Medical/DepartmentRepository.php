<?php
namespace App\Repositories\Medical;

use App\Models\Department;
use Illuminate\Database\Eloquent\Collection;

class DepartmentRepository
{
    public function getAll(bool $onlyActive = false): Collection
    {
        $query = Department::query();
        if ($onlyActive) {
            $query->where('is_active', true);
        }
        return $query->get();
    }

    public function findById(int $id): ?Department
    {
        return Department::find($id);
    }

    public function create(array $data): Department
    {
        return Department::create($data);
    }

    public function update(Department $department, array $data): Department
    {
        $department->update($data);
        return $department;
    }

    public function delete(Department $department): bool
    {
        return $department->delete();
    }
}
