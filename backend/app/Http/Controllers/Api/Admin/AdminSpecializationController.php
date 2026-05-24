<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSpecializationRequest;
use App\Http\Resources\Medical\SpecializationResource;
use App\Services\Medical\SpecializationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSpecializationController extends Controller
{
    public function __construct(
        protected SpecializationService $specializationService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $specializations = $this->specializationService->getAllSpecializations($request->all());
        return response()->json([
            'data' => SpecializationResource::collection($specializations)
        ]);
    }

    public function store(StoreSpecializationRequest $request): JsonResponse
    {
        try {
            $specialization = $this->specializationService->createSpecialization($request->validated());
            return response()->json([
                'message' => 'Specialization created successfully',
                'data' => new SpecializationResource($specialization)
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        $specialization = $this->specializationService->getSpecializationById($id);
        if (!$specialization) {
            return response()->json(['message' => 'Specialization not found'], 404);
        }
        return response()->json([
            'data' => new SpecializationResource($specialization->load('department'))
        ]);
    }

    public function update(StoreSpecializationRequest $request, int $id): JsonResponse
    {
        try {
            $specialization = $this->specializationService->updateSpecialization($id, $request->validated());
            return response()->json([
                'message' => 'Specialization updated successfully',
                'data' => new SpecializationResource($specialization)
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->specializationService->deleteSpecialization($id);
            return response()->json(['message' => 'Specialization deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
