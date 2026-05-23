<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\Auth\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function register(RegisterRequest $request)
    {
        return response()->json(
            $this->authService->register($request->validated()),
            201
        );
    }

    public function login(LoginRequest $request)
    {
        return response()->json(
            $this->authService->login($request->validated())
        );
    }

    public function currentUser(Request $request)
    {
        $user = $this->authService->getCurrentUser($request->user());
        return new UserResource($user);
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());
        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
