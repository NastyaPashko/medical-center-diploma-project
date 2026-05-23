<?php
namespace App\Repositories\Medical;

use App\Models\DoctorProfile;
use Illuminate\Database\Eloquent\Collection;

class DoctorProfileRepository
{
    public function getAll(array $filters = [], bool $onlyAvailable = false): Collection
    {
        $query = DoctorProfile::query()
            ->with(['user', 'department', 'specialization']);

        if ($onlyAvailable) {
            $query->where('is_available', true);
        }

        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        if (!empty($filters['specialization_id'])) {
            $query->where('specialization_id', $filters['specialization_id']);
        }

        if (!empty($filters['name'])) {
            $query->whereHas('user', function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['name'] . '%');
            });
        }

        return $query->get();
    }

    public function findById(int $id): ?DoctorProfile
    {
        return DoctorProfile::with(['user', 'department', 'specialization'])->find($id);
    }

    public function create(array $data): DoctorProfile
    {
        return DoctorProfile::create($data);
    }

    public function update(DoctorProfile $profile, array $data): DoctorProfile
    {
        $profile->update($data);
        return $profile;
    }

    public function delete(DoctorProfile $profile): bool
    {
        // Note: You might want to delete the user or just the profile
        return $profile->delete();
    }
}
