<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Medical\DoctorScheduleResource;
use App\Services\Medical\DoctorScheduleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorScheduleController extends Controller
{
    public function __construct(
        protected DoctorScheduleService $scheduleService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->doctorProfile) {
            return response()->json(['message' => 'Doctor profile not found'], 404);
        }

        $schedules = $this->scheduleService->getDoctorSchedules($user->doctorProfile->id);

        return response()->json([
            'data' => DoctorScheduleResource::collection($schedules)
        ]);
    }
}
