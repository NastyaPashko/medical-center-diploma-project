<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Medical\UpdateDoctorProfileRequest;
use App\Http\Resources\Medical\DoctorResource;
use App\Services\Medical\DoctorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DoctorProfileController extends Controller
{
    public function __construct(
        protected DoctorService $doctorService
    ) {}

    public function show(): JsonResponse
    {
        $userId = Auth::id();
        $profile = $this->doctorService->getProfileByUserId($userId);

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json([
            'data' => new DoctorResource($profile->load(['user', 'department', 'specialization']))
        ]);
    }

    public function update(UpdateDoctorProfileRequest $request): JsonResponse
    {
        try {
            $userId = Auth::id();
            $profile = $this->doctorService->updateProfileByUserId($userId, $request->validated());

            return response()->json([
                'message' => 'Profile updated successfully',
                'data' => new DoctorResource($profile->load(['user', 'department', 'specialization']))
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }
}
