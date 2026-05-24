<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDepartmentRequest;
use App\Http\Resources\Medical\DepartmentResource;
use App\Services\Medical\DepartmentService;
use Illuminate\Http\JsonResponse;

class AdminDepartmentController extends Controller
{
    public function __construct(
        protected DepartmentService $departmentService
    ) {}

    public function index(): JsonResponse
    {
        $departments = $this->departmentService->getAllDepartments();
        return response()->json([
            'data' => DepartmentResource::collection($departments)
        ]);
    }

    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        try {
            $department = $this->departmentService->createDepartment($request->validated());
            return response()->json([
                'message' => 'Department created successfully',
                'data' => new DepartmentResource($department)
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        $department = $this->departmentService->getDepartmentById($id);
        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }
        return response()->json([
            'data' => new DepartmentResource($department)
        ]);
    }

    public function update(StoreDepartmentRequest $request, int $id): JsonResponse
    {
        try {
            $department = $this->departmentService->updateDepartment($id, $request->validated());
            return response()->json([
                'message' => 'Department updated successfully',
                'data' => new DepartmentResource($department)
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->departmentService->deleteDepartment($id);
            return response()->json(['message' => 'Department deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
