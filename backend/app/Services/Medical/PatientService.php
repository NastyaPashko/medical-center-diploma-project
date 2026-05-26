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

        $user = $profile->user;

        // Update basic user info
        $userData = [];
        if (isset($data['name'])) {
            $userData['name'] = $data['name'];
            unset($data['name']);
        }
        if (isset($data['phone'])) {
            $userData['phone'] = $data['phone'];
            unset($data['phone']);
        }

        if (isset($data['avatar'])) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $data['avatar']->store('avatars', 'public');
            $userData['avatar'] = $path;
            unset($data['avatar']);
        }

        if (!empty($userData)) {
            $user->update($userData);
        }

        return $this->patientProfileRepository->update($profile, $data);
    }

    public function updatePatient(int $id, array $data): PatientProfile
    {
        $profile = $this->patientProfileRepository->findById($id);
        if (!$profile) {
            throw new \Exception('Patient not found');
        }

        $user = $profile->user;

        // Update basic user info
        $userData = [];
        if (isset($data['name'])) {
            $userData['name'] = $data['name'];
            unset($data['name']);
        }
        if (isset($data['phone'])) {
            $userData['phone'] = $data['phone'];
            unset($data['phone']);
        }

        if (isset($data['avatar'])) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $data['avatar']->store('avatars', 'public');
            $userData['avatar'] = $path;
            unset($data['avatar']);
        }

        if (!empty($userData)) {
            $user->update($userData);
        }

        return $this->patientProfileRepository->update($profile, $data);
    }
}
