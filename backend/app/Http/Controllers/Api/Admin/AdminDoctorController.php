<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDoctorProfileRequest;
use App\Http\Requests\Admin\UpdateDoctorProfileRequest;
use App\Http\Resources\Medical\DoctorResource;
use App\Services\Medical\DoctorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDoctorController extends Controller
{
    public function __construct(
        protected DoctorService $doctorService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $doctors = $this->doctorService->getAllDoctors($request->all());
        return response()->json([
            'data' => DoctorResource::collection($doctors)
        ]);
    }

    public function store(StoreDoctorProfileRequest $request): JsonResponse
    {
        $doctor = $this->doctorService->createDoctor($request->validated());
        return response()->json([
            'message' => 'Doctor profile created successfully',
            'data' => new DoctorResource($doctor)
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $doctor = $this->doctorService->getDoctorById($id);
        if (!$doctor) {
            return response()->json(['message' => 'Doctor not found'], 404);
        }
        return response()->json([
            'data' => new DoctorResource($doctor->load(['user', 'department', 'specialization']))
        ]);
    }

    public function update(UpdateDoctorProfileRequest $request, int $id): JsonResponse
    {
        try {
            // Adjust validation for update (user_id uniqueness check needs to ignore current)
            $data = $request->validated();
            $doctor = $this->doctorService->updateDoctor($id, $data);
            return response()->json([
                'message' => 'Doctor profile updated successfully',
                'data' => new DoctorResource($doctor)
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->doctorService->deleteDoctor($id);
            return response()->json(['message' => 'Doctor profile deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }
}
