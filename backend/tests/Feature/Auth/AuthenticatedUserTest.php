<?php

namespace Tests\Feature\Auth;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticatedUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_get_their_details()
    {
        $role = Role::create(['name' => 'patient']);
        $user = User::create([
            'name' => 'Stacy Doe',
            'email' => 'stacy@example.com',
            'password' => 'password123',
            'role_id' => $role->id,
        ]);

        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->getJson('/api/user', [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $user->id,
                    'name' => 'Stacy Doe',
                    'email' => 'stacy@example.com',
                    'role' => 'patient',
                ]
            ]);
    }

    public function test_unauthenticated_user_cannot_access_user_details()
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_logout()
    {
        $role = Role::create(['name' => 'patient']);
        $user = User::create([
            'name' => 'Stacy Doe',
            'email' => 'stacy@example.com',
            'password' => 'password123',
            'role_id' => $role->id,
        ]);

        $token = $user->createToken('test_token')->plainTextToken;
        $this->assertCount(1, $user->tokens);

        $response = $this->postJson('/api/logout', [], [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Logged out successfully']);

        $this->assertCount(0, $user->fresh()->tokens);
    }

    public function test_unauthenticated_user_cannot_logout()
    {
        $response = $this->postJson('/api/logout');

        $response->assertStatus(401);
    }
}
