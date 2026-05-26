<?php

namespace App\Http\Controllers\Api\Doctor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Medical\DoctorScheduleResource;
use App\Services\Medical\DoctorScheduleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DoctorScheduleController extends Controller
{
    public function __construct(
        protected DoctorScheduleService $doctorScheduleService
    ) {}

    public function index(): JsonResponse
    {
        $schedules = $this->doctorScheduleService->getSchedulesForUserId(Auth::id());

        if ($schedules === null) {
            return response()->json(['message' => 'Doctor profile not found'], 404);
        }

        return response()->json([
            'data' => DoctorScheduleResource::collection($schedules),
        ]);
    }
}
