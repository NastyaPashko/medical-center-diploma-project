<?php
namespace App\Repositories\Medical;

use App\Models\PatientProfile;
use Illuminate\Database\Eloquent\Collection;

class PatientProfileRepository
{
    public function getAll(): Collection
    {
        return PatientProfile::with('user')->get();
    }

    public function findById(int $id): ?PatientProfile
    {
        return PatientProfile::with('user')->find($id);
    }

    public function update(PatientProfile $profile, array $data): PatientProfile
    {
        $profile->update($data);
        return $profile;
    }
}
