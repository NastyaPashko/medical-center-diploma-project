<?php
namespace App\Services\Medical;

use App\Repositories\Medical\PatientProfileRepository;
use App\Models\PatientProfile;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;

class PatientService
{
    public function __construct(
        protected PatientProfileRepository $patientProfileRepository
    ) {}

    public function getAllPatients(): Collection
    {
        return $this->patientProfileRepository->getAll();
    }

    public function getPatientById(int $id): ?PatientProfile
    {
        return $this->patientProfileRepository->findById($id);
    }

    public function getProfileByUserId(int $userId): ?PatientProfile
    {
        return $this->patientProfileRepository->findByUserId($userId);
    }

    public function updateProfileByUserId(int $userId, array $data): PatientProfile
    {
        $profile = $this->patientProfileRepository->findByUserId($userId);
        if (!$profile) {
            throw new \Exception('Patient profile not found');
        }

        if (isset($data['avatar'])) {
            $user = $profile->user;
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $data['avatar']->store('avatars', 'public');
            $user->update(['avatar' => $path]);
            unset($data['avatar']);
        }

        return $this->patientProfileRepository->update($profile, $data);
    }

    public function updatePatient(int $id, array $data): PatientProfile
    {
        $profile = $this->patientProfileRepository->findById($id);
        if (!$profile) {
            throw new \Exception('Patient not found');
        }

        if (isset($data['avatar'])) {
            $user = $profile->user;
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $data['avatar']->store('avatars', 'public');
            $user->update(['avatar' => $path]);
            unset($data['avatar']);
        }

        return $this->patientProfileRepository->update($profile, $data);
    }
}
