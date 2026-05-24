<?php
namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePatientProfileRequest;
use App\Http\Resources\Medical\PatientResource;
use App\Services\Medical\PatientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PatientProfileController extends Controller
{
    public function __construct(
        protected PatientService $patientService
    ) {}

    public function show(): JsonResponse
    {
        $userId = Auth::id();
        $profile = $this->patientService->getProfileByUserId($userId);

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json([
            'data' => new PatientResource($profile->load('user'))
        ]);
    }

    public function update(UpdatePatientProfileRequest $request): JsonResponse
    {
        try {
            $userId = Auth::id();
            $profile = $this->patientService->updateProfileByUserId($userId, $request->validated());

            return response()->json([
                'message' => 'Profile updated successfully',
                'data' => new PatientResource($profile->load('user'))
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }
}
