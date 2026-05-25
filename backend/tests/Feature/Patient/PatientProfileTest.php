<?php

namespace Tests\Feature\Patient;

use App\Models\Role;
use App\Models\User;
use App\Models\PatientProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PatientProfileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\RoleSeeder::class);
        Storage::fake('public');
    }

    public function test_patient_can_view_own_profile()
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', Role::PATIENT)->first()->id
        ]);

        // Profile should be created by AuthService during registration/creation in my test if I use AuthService or manual creation
        $profile = PatientProfile::create(['user_id' => $user->id, 'notes' => 'Test notes']);

        $response = $this->actingAs($user)->getJson('/api/patient/profile');

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'user_id' => $user->id,
                    'notes' => 'Test notes',
                    'user' => [
                        'avatar_url' => null
                    ]
                ]
            ]);
    }

    public function test_patient_can_update_own_profile_including_avatar()
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', Role::PATIENT)->first()->id
        ]);
        PatientProfile::create(['user_id' => $user->id]);

        $avatar = UploadedFile::fake()->create('avatar.jpg', 100); // 100 KB file

        $response = $this->actingAs($user)->postJson('/api/patient/profile', [
            '_method' => 'PUT',
            'date_of_birth' => '1990-01-01',
            'gender' => 'female',
            'notes' => 'Updated notes',
            'avatar' => $avatar,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Profile updated successfully',
                'data' => [
                    'date_of_birth' => '1990-01-01',
                    'gender' => 'female',
                    'notes' => 'Updated notes'
                ]
            ]);

        $user->refresh();
        $this->assertNotNull($user->avatar);
        Storage::disk('public')->assertExists($user->avatar);

        $this->assertDatabaseHas('patient_profiles', [
            'user_id' => $user->id,
            'notes' => 'Updated notes'
        ]);
    }

    public function test_patient_can_update_own_profile()
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', Role::PATIENT)->first()->id
        ]);
        PatientProfile::create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->putJson('/api/patient/profile', [
            'date_of_birth' => '1990-01-01',
            'gender' => 'female',
            'address' => '123 Test St',
            'emergency_contact_name' => 'John Doe',
            'emergency_contact_phone' => '987654321',
            'insurance_number' => 'INS123',
            'notes' => 'Updated notes'
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Profile updated successfully',
                'data' => [
                    'date_of_birth' => '1990-01-01',
                    'gender' => 'female',
                    'notes' => 'Updated notes'
                ]
            ]);

        $this->assertDatabaseHas('patient_profiles', [
            'user_id' => $user->id,
            'notes' => 'Updated notes'
        ]);
    }

    public function test_admin_can_view_all_patients()
    {
        $admin = User::factory()->create([
            'role_id' => Role::where('name', Role::ADMIN)->first()->id
        ]);

        $patientUser = User::factory()->create([
            'role_id' => Role::where('name', Role::PATIENT)->first()->id
        ]);
        PatientProfile::create(['user_id' => $patientUser->id]);

        $response = $this->actingAs($admin)->getJson('/api/admin/patients');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_admin_can_view_specific_patient()
    {
        $admin = User::factory()->create([
            'role_id' => Role::where('name', Role::ADMIN)->first()->id
        ]);

        $patientUser = User::factory()->create([
            'role_id' => Role::where('name', Role::PATIENT)->first()->id
        ]);
        $profile = PatientProfile::create(['user_id' => $patientUser->id, 'notes' => 'Admin viewing']);

        $response = $this->actingAs($admin)->getJson("/api/admin/patients/{$profile->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $profile->id,
                    'notes' => 'Admin viewing'
                ]
            ]);
    }

    public function test_non_admin_cannot_view_all_patients()
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', Role::PATIENT)->first()->id
        ]);

        $response = $this->actingAs($user)->getJson('/api/admin/patients');

        $response->assertStatus(403);
    }

    public function test_profile_validation_rules()
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', Role::PATIENT)->first()->id
        ]);
        PatientProfile::create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->putJson('/api/patient/profile', [
            'date_of_birth' => now()->addDay()->format('Y-m-d'), // future date
            'gender' => 'invalid',
            'address' => str_repeat('a', 256),
            'emergency_contact_name' => str_repeat('a', 101),
            'emergency_contact_phone' => str_repeat('1', 31),
            'insurance_number' => str_repeat('i', 101),
            'notes' => str_repeat('n', 1001),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'date_of_birth',
                'gender',
                'address',
                'emergency_contact_name',
                'emergency_contact_phone',
                'insurance_number',
                'notes'
            ]);
    }
}
