<?php

namespace Tests\Feature\Feature;

use App\Models\Role;
use App\Models\User;
use App\Models\PatientProfile;
use App\Models\DoctorProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_patient_can_view_profile()
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', Role::PATIENT)->first()->id
        ]);
        $profile = PatientProfile::create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson('/api/patient/profile');

        $response->assertStatus(200)
            ->assertJsonPath('data.user.email', $user->email);
    }

    public function test_patient_can_update_profile()
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'role_id' => Role::where('name', Role::PATIENT)->first()->id,
            'name' => 'Old Name'
        ]);
        $profile = PatientProfile::create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->putJson('/api/patient/profile', [
            'name' => 'New Name',
            'phone' => '123456789',
            'address' => 'New Address'
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.user.name', 'New Name');

        $user->refresh();
        $this->assertEquals('New Name', $user->name);
        $this->assertEquals('123456789', $user->phone);

        $profile->refresh();
        $this->assertEquals('New Address', $profile->address);
    }

    public function test_doctor_can_update_profile()
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'role_id' => Role::where('name', Role::DOCTOR)->first()->id,
            'name' => 'Dr. Old'
        ]);

        $department = \App\Models\Department::first() ?: \App\Models\Department::create(['name' => 'Test Dept']);
        $specialization = \App\Models\Specialization::first() ?: \App\Models\Specialization::create([
            'name' => 'Test Spec',
            'department_id' => $department->id
        ]);

        $profile = DoctorProfile::create([
            'user_id' => $user->id,
            'department_id' => $department->id,
            'specialization_id' => $specialization->id,
            'bio' => 'Old bio',
            'experience_years' => 5,
            'consultation_price' => 100
        ]);

        $response = $this->actingAs($user)->putJson('/api/doctor/profile', [
            'name' => 'Dr. New',
            'bio' => 'Updated bio'
        ]);

        $response->assertStatus(200);

        $user->refresh();
        $this->assertEquals('Dr. New', $user->name);

        $profile->refresh();
        $this->assertEquals('Updated bio', $profile->bio);
    }

    public function test_admin_can_update_profile()
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'role_id' => Role::where('name', Role::ADMIN)->first()->id,
            'name' => 'Admin User'
        ]);

        $response = $this->actingAs($user)->putJson('/api/admin/profile', [
            'name' => 'Updated Admin',
            'phone' => '999999'
        ]);

        $response->assertStatus(200);

        $user->refresh();
        $this->assertEquals('Updated Admin', $user->name);
        $this->assertEquals('999999', $user->phone);
    }
}
