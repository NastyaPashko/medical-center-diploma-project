<?php
namespace App\Services\Medical;

use App\Repositories\Medical\MedicalServiceRepository;
use App\Models\MedicalService;
use Illuminate\Database\Eloquent\Collection;

class MedicalServiceService
{
    public function __construct(
        protected MedicalServiceRepository $medicalServiceRepository
    ) {}

    public function getAllServices(array $filters = [], bool $onlyActive = false): Collection
    {
        return $this->medicalServiceRepository->getAll($filters, $onlyActive);
    }

    public function getServiceById(int $id): ?MedicalService
    {
        return $this->medicalServiceRepository->findById($id);
    }

    public function createService(array $data): MedicalService
    {
        return $this->medicalServiceRepository->create($data);
    }

    public function updateService(int $id, array $data): MedicalService
    {
        $service = $this->medicalServiceRepository->findById($id);
        if (!$service) {
            throw new \Exception('Service not found');
        }
        return $this->medicalServiceRepository->update($service, $data);
    }

    public function deleteService(int $id): bool
    {
        $service = $this->medicalServiceRepository->findById($id);
        if (!$service) {
            throw new \Exception('Service not found');
        }
        return $this->medicalServiceRepository->delete($service);
    }
}
