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

    public function updatePatient(int $id, array $data): PatientProfile
    {
        $profile = $this->patientProfileRepository->findById($id);
        if (!$profile) {
            throw new \Exception('Patient not found');
        }
        return $this->patientProfileRepository->update($profile, $data);
    }
}
