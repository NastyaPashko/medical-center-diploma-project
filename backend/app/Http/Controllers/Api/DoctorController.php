<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Medical\DoctorResource;
use App\Services\Medical\DoctorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function __construct(
        protected DoctorService $doctorService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $doctors = $this->doctorService->getAllDoctors($request->all(), true);
        return response()->json([
            'data' => DoctorResource::collection($doctors)
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $doctor = $this->doctorService->getDoctorById($id);
        if (!$doctor || !$doctor->is_available) {
            return response()->json(['message' => 'Doctor not found or unavailable'], 404);
        }
        return response()->json([
            'data' => new DoctorResource($doctor->load(['user', 'department', 'specialization']))
        ]);
    }
}
