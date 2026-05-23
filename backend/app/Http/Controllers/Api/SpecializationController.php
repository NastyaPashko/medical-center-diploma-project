<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Medical\SpecializationResource;
use App\Services\Medical\SpecializationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SpecializationController extends Controller
{
    public function __construct(
        protected SpecializationService $specializationService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $specializations = $this->specializationService->getAllSpecializations($request->all(), true);
        return response()->json([
            'data' => SpecializationResource::collection($specializations)
        ]);
    }
}
