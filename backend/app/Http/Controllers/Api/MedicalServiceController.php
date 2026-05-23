<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Medical\MedicalServiceResource;
use App\Services\Medical\MedicalServiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicalServiceController extends Controller
{
    public function __construct(
        protected MedicalServiceService $medicalServiceService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $services = $this->medicalServiceService->getAllServices($request->all(), true);
        return response()->json([
            'data' => MedicalServiceResource::collection($services)
        ]);
    }
}
