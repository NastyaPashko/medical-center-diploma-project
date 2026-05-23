<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Medical\DepartmentResource;
use App\Services\Medical\DepartmentService;
use Illuminate\Http\JsonResponse;

class DepartmentController extends Controller
{
    public function __construct(
        protected DepartmentService $departmentService
    ) {}

    public function index(): JsonResponse
    {
        $departments = $this->departmentService->getAllDepartments(true);
        return response()->json([
            'data' => DepartmentResource::collection($departments)
        ]);
    }
}
