<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDoctorScheduleRequest;
use App\Http\Requests\Admin\UpdateDoctorScheduleRequest;
use App\Http\Resources\Medical\DoctorScheduleResource;
use App\Services\Medical\DoctorScheduleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDoctorScheduleController extends Controller
{
    public function __construct(
        protected DoctorScheduleService $doctorScheduleService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $schedules = $this->doctorScheduleService->getAllSchedules($request->all());

        return response()->json([
            'data' => DoctorScheduleResource::collection($schedules),
        ]);
    }

    public function store(StoreDoctorScheduleRequest $request): JsonResponse
    {
        try {
            $schedule = $this->doctorScheduleService->createSchedule($request->validated());

            return response()->json([
                'message' => 'Doctor schedule created successfully',
                'data' => new DoctorScheduleResource($schedule),
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        $schedule = $this->doctorScheduleService->getScheduleById($id);
        if (!$schedule) {
            return response()->json(['message' => 'Schedule not found'], 404);
        }

        return response()->json([
            'data' => new DoctorScheduleResource($schedule),
        ]);
    }

    public function update(UpdateDoctorScheduleRequest $request, int $id): JsonResponse
    {
        try {
            $schedule = $this->doctorScheduleService->updateSchedule($id, $request->validated());

            return response()->json([
                'message' => 'Doctor schedule updated successfully',
                'data' => new DoctorScheduleResource($schedule),
            ]);
        } catch (\Exception $e) {
            $status = $e->getMessage() === 'Schedule not found' ? 404 : 400;

            return response()->json(['message' => $e->getMessage()], $status);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->doctorScheduleService->deleteSchedule($id);

            return response()->json(['message' => 'Doctor schedule deleted successfully']);
        } catch (\Exception $e) {
            $status = $e->getMessage() === 'Schedule not found' ? 404 : 400;

            return response()->json(['message' => $e->getMessage()], $status);
        }
    }
}
