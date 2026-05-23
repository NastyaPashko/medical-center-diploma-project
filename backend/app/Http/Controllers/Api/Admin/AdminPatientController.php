<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePatientProfileRequest;
use App\Http\Resources\Medical\PatientResource;
use App\Services\Medical\PatientService;
use Illuminate\Http\JsonResponse;

class AdminPatientController extends Controller
{
    public function __construct(
        protected PatientService $patientService
    ) {}

    public function index(): JsonResponse
    {
        $patients = $this->patientService->getAllPatients();
        return response()->json([
            'data' => PatientResource::collection($patients)
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $patient = $this->patientService->getPatientById($id);
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }
        return response()->json([
            'data' => new PatientResource($patient->load('user'))
        ]);
    }

    public function update(UpdatePatientProfileRequest $request, int $id): JsonResponse
    {
        try {
            $patient = $this->patientService->updatePatient($id, $request->validated());
            return response()->json([
                'message' => 'Patient profile updated successfully',
                'data' => new PatientResource($patient)
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }
}
