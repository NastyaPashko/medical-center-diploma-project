<?php

namespace Tests\Feature\Auth;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_as_patient_by_default()
    {
        $this->seed(\RoleSeeder::class);

        $response = $this->postJson('/api/register', [
            'name' => 'Stacy Doe',
            'email' => 'stacy@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '123456789',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'user' => [
                    'id', 'name', 'email', 'role', 'avatar_url'
                ],
                'token',
            ]);

        $user = User::where('email', 'stacy@example.com')->first();
        $this->assertNotNull($user);

        $patientRole = Role::where('name', Role::PATIENT)->first();
        $this->assertEquals($patientRole->id, $user->role_id);
    }

    public function test_registration_requires_mandatory_fields()
    {
        $response = $this->postJson('/api/register', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_registration_password_confirmation()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Stacy Doe',
            'email' => 'stacy@example.com',
            'password' => 'password123',
            'password_confirmation' => 'wrong_password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_registration_fails_if_phone_already_exists()
    {
        $this->seed(\RoleSeeder::class);
        $role = Role::where('name', Role::PATIENT)->first();

        User::factory()->create([
            'phone' => '123456789',
            'role_id' => $role->id,
        ]);

        $response = $this->postJson('/api/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '123456789',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }
}
