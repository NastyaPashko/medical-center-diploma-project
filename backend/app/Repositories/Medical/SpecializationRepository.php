<?php
namespace App\Repositories\Medical;

use App\Models\Specialization;
use Illuminate\Database\Eloquent\Collection;

class SpecializationRepository
{
    public function getAll(array $filters = [], bool $onlyActive = false): Collection
    {
        $query = Specialization::query();

        if ($onlyActive) {
            $query->where('is_active', true);
        }

        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        return $query->with('department')->get();
    }

    public function findById(int $id): ?Specialization
    {
        return Specialization::with('department')->find($id);
    }

    public function create(array $data): Specialization
    {
        return Specialization::create($data);
    }

    public function update(Specialization $specialization, array $data): Specialization
    {
        $specialization->update($data);
        return $specialization;
    }

    public function delete(Specialization $specialization): bool
    {
        return $specialization->delete();
    }
}
