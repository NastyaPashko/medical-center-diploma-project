<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMedicalServiceRequest;
use App\Http\Resources\Medical\MedicalServiceResource;
use App\Services\Medical\MedicalServiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminMedicalServiceController extends Controller
{
    public function __construct(
        protected MedicalServiceService $medicalServiceService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $services = $this->medicalServiceService->getAllServices($request->all());
        return response()->json([
            'data' => MedicalServiceResource::collection($services)
        ]);
    }

    public function store(StoreMedicalServiceRequest $request): JsonResponse
    {
        try {
            $service = $this->medicalServiceService->createService($request->validated());
            return response()->json([
                'message' => 'Medical service created successfully',
                'data' => new MedicalServiceResource($service)
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        $service = $this->medicalServiceService->getServiceById($id);
        if (!$service) {
            return response()->json(['message' => 'Medical service not found'], 404);
        }
        return response()->json([
            'data' => new MedicalServiceResource($service->load(['department', 'specialization']))
        ]);
    }

    public function update(StoreMedicalServiceRequest $request, int $id): JsonResponse
    {
        try {
            $service = $this->medicalServiceService->updateService($id, $request->validated());
            return response()->json([
                'message' => 'Medical service updated successfully',
                'data' => new MedicalServiceResource($service)
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->medicalServiceService->deleteService($id);
            return response()->json(['message' => 'Medical service deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
