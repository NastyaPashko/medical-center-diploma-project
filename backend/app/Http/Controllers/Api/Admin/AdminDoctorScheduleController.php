<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Medical\DoctorScheduleRequest;
use App\Http\Resources\Medical\DoctorScheduleResource;
use App\Services\Medical\DoctorScheduleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDoctorScheduleController extends Controller
{
    public function __construct(
        protected DoctorScheduleService $scheduleService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $schedules = $this->scheduleService->getAllSchedules($request->all());
        return response()->json([
            'data' => DoctorScheduleResource::collection($schedules)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DoctorScheduleRequest $request): JsonResponse
    {
        $schedule = $this->scheduleService->createSchedule($request->validated());
        return response()->json([
            'message' => 'Schedule created successfully',
            'data' => new DoctorScheduleResource($schedule)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $schedule = $this->scheduleService->getScheduleById($id);
        if (!$schedule) {
            return response()->json(['message' => 'Schedule not found'], 404);
        }
        return response()->json([
            'data' => new DoctorScheduleResource($schedule->load('doctorProfile.user'))
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DoctorScheduleRequest $request, int $id): JsonResponse
    {
        try {
            $schedule = $this->scheduleService->updateSchedule($id, $request->validated());
            return response()->json([
                'message' => 'Schedule updated successfully',
                'data' => new DoctorScheduleResource($schedule)
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->scheduleService->deleteSchedule($id);
            return response()->json(['message' => 'Schedule deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }
}
