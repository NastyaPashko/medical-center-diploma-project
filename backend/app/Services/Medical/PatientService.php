<?php
namespace App\Services\Medical;

use App\Repositories\Medical\PatientProfileRepository;
use App\Models\PatientProfile;
use Illuminate\Database\Eloquent\Collection;

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
            // If profile doesn't exist, we might want to create it or throw error.
            // Based on requirements, it should exist if user is a patient,
            // but let's be safe and throw for now as we don't have auto-creation logic here yet.
            throw new \Exception('Patient profile not found');
        }
        return $this->patientProfileRepository->update($profile, $data);
    }

    public function updatePatient(int $id, array $data): PatientProfile
    {
        $profile = $this->patientProfileRepository->findById($id);
        if (!$profile) {
            throw new \Exception('Patient not found');
        }
        return $this->patientProfileRepository->update($profile, $data);
    }
}
