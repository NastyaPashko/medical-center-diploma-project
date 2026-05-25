<?php

namespace Tests\Feature\Admin;

use App\Models\Department;
use App\Models\DoctorProfile;
use App\Models\Role;
use App\Models\Specialization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDoctorTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected Department $department;
    protected Specialization $specialization;

    protected function setUp(): void
    {
        parent::setUp();

        $adminRole = Role::create(['name' => Role::ADMIN]);
        Role::create(['name' => Role::DOCTOR]);

        $this->admin = User::factory()->create([
            'role_id' => $adminRole->id,
        ]);

        $this->department = Department::create(['name' => 'Cardiology', 'is_active' => true]);
        $this->specialization = Specialization::create([
            'name' => 'Cardiologist',
            'department_id' => $this->department->id,
            'is_active' => true
        ]);
    }

    public function test_admin_can_list_doctors(): void
    {
        $doctorUser = User::factory()->create(['role_id' => Role::where('name', Role::DOCTOR)->first()->id]);
        DoctorProfile::create([
            'user_id' => $doctorUser->id,
            'department_id' => $this->department->id,
            'specialization_id' => $this->specialization->id,
            'consultation_price' => 100,
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/admin/doctors');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_admin_can_create_doctor_profile(): void
    {
        $doctorUser = User::factory()->create(['role_id' => Role::where('name', Role::DOCTOR)->first()->id]);

        $response = $this->actingAs($this->admin)->postJson('/api/admin/doctors', [
            'user_id' => $doctorUser->id,
            'department_id' => $this->department->id,
            'specialization_id' => $this->specialization->id,
            'bio' => 'Experienced cardiologist',
            'experience_years' => 10,
            'education' => 'Medical University',
            'office_number' => '101',
            'consultation_price' => 150.50,
            'is_available' => true,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.bio', 'Experienced cardiologist');

        $this->assertDatabaseHas('doctor_profiles', [
            'user_id' => $doctorUser->id,
            'consultation_price' => 150.50,
        ]);
    }

    public function test_admin_can_update_doctor_profile(): void
    {
        $doctorUser = User::factory()->create(['role_id' => Role::where('name', Role::DOCTOR)->first()->id]);
        $doctorProfile = DoctorProfile::create([
            'user_id' => $doctorUser->id,
            'department_id' => $this->department->id,
            'specialization_id' => $this->specialization->id,
            'consultation_price' => 100,
        ]);

        $response = $this->actingAs($this->admin)->putJson("/api/admin/doctors/{$doctorProfile->id}", [
            'bio' => 'Updated bio',
            'consultation_price' => 200,
            'is_available' => false,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.bio', 'Updated bio')
            ->assertJsonPath('data.is_available', false);

        $this->assertDatabaseHas('doctor_profiles', [
            'id' => $doctorProfile->id,
            'consultation_price' => 200,
            'is_available' => false,
        ]);
    }

    public function test_admin_can_delete_doctor_profile(): void
    {
        $doctorUser = User::factory()->create(['role_id' => Role::where('name', Role::DOCTOR)->first()->id]);
        $doctorProfile = DoctorProfile::create([
            'user_id' => $doctorUser->id,
            'department_id' => $this->department->id,
            'specialization_id' => $this->specialization->id,
            'consultation_price' => 100,
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/admin/doctors/{$doctorProfile->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('doctor_profiles', ['id' => $doctorProfile->id]);
    }
}
