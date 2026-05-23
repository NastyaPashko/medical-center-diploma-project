<?php
namespace App\Services\Auth;

use App\Models\Role;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        protected UserRepository $userRepository
    ) {}

    /**
     * @param array $data
     * @return array{user: User, token: string}
     */
    public function register(array $data): array
    {
        $patientRole = Role::where('name', Role::PATIENT)->firstOrFail();

        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role_id' => $patientRole->id,
            'phone' => $data['phone'] ?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * @param array $data
     * @return array{user: User, token: string}
     */
    public function login(array $data): array
    {
        $user = $this->userRepository->findByEmail($data['email']);

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function getCurrentUser(User $user): User
    {
        return $user->loadMissing('role');
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }
}
