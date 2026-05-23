<?php
namespace App\Repositories\Medical;

use App\Models\MedicalService;
use Illuminate\Database\Eloquent\Collection;

class MedicalServiceRepository
{
    public function getAll(array $filters = [], bool $onlyActive = false): Collection
    {
        $query = MedicalService::query();

        if ($onlyActive) {
            $query->where('is_active', true);
        }

        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        if (!empty($filters['specialization_id'])) {
            $query->where('specialization_id', $filters['specialization_id']);
        }

        return $query->with(['department', 'specialization'])->get();
    }

    public function findById(int $id): ?MedicalService
    {
        return MedicalService::with(['department', 'specialization'])->find($id);
    }

    public function create(array $data): MedicalService
    {
        return MedicalService::create($data);
    }

    public function update(MedicalService $service, array $data): MedicalService
    {
        $service->update($data);
        return $service;
    }

    public function delete(MedicalService $service): bool
    {
        return $service->delete();
    }
}
