<?php

namespace Tests\Feature\Admin;

use App\Models\Department;
use App\Models\DoctorProfile;
use App\Models\DoctorSchedule;
use App\Models\Role;
use App\Models\Specialization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDoctorScheduleTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected DoctorProfile $doctorProfile;

    protected function setUp(): void
    {
        parent::setUp();

        $adminRole = Role::create(['name' => Role::ADMIN]);
        Role::create(['name' => Role::DOCTOR]);

        $this->admin = User::factory()->create([
            'role_id' => $adminRole->id,
        ]);

        $department = Department::create(['name' => 'Cardiology', 'is_active' => true]);
        $specialization = Specialization::create([
            'name' => 'Cardiologist',
            'department_id' => $department->id,
            'is_active' => true,
        ]);

        $doctorUser = User::factory()->create([
            'role_id' => Role::where('name', Role::DOCTOR)->first()->id,
        ]);

        $this->doctorProfile = DoctorProfile::create([
            'user_id' => $doctorUser->id,
            'department_id' => $department->id,
            'specialization_id' => $specialization->id,
            'consultation_price' => 100,
        ]);
    }

    public function test_admin_can_list_doctor_schedules(): void
    {
        DoctorSchedule::create([
            'doctor_id' => $this->doctorProfile->id,
            'day_of_week' => 1,
            'start_time' => '09:00',
            'end_time' => '17:00',
            'slot_duration_minutes' => 30,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/admin/doctor-schedules');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_admin_can_filter_schedules_by_doctor(): void
    {
        DoctorSchedule::create([
            'doctor_id' => $this->doctorProfile->id,
            'day_of_week' => 1,
            'start_time' => '09:00',
            'end_time' => '12:00',
            'slot_duration_minutes' => 30,
        ]);

        $response = $this->actingAs($this->admin)->getJson(
            '/api/admin/doctor-schedules?doctor_id=' . $this->doctorProfile->id
        );

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_admin_can_create_doctor_schedule(): void
    {
        $data = [
            'doctor_id' => $this->doctorProfile->id,
            'day_of_week' => 2,
            'start_time' => '10:00',
            'end_time' => '16:00',
            'slot_duration_minutes' => 20,
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/admin/doctor-schedules', $data);

        $response->assertStatus(201)
            ->assertJsonPath('data.day_of_week', 2)
            ->assertJsonPath('data.slot_duration_minutes', 20);

        $this->assertDatabaseHas('doctor_schedules', [
            'doctor_id' => $this->doctorProfile->id,
            'day_of_week' => 2,
            'slot_duration_minutes' => 20,
        ]);
    }

    public function test_admin_cannot_create_schedule_with_invalid_time_range(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/admin/doctor-schedules', [
            'doctor_id' => $this->doctorProfile->id,
            'day_of_week' => 1,
            'start_time' => '17:00',
            'end_time' => '09:00',
            'slot_duration_minutes' => 30,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['end_time']);
    }

    public function test_admin_can_update_doctor_schedule(): void
    {
        $schedule = DoctorSchedule::create([
            'doctor_id' => $this->doctorProfile->id,
            'day_of_week' => 3,
            'start_time' => '09:00',
            'end_time' => '12:00',
            'slot_duration_minutes' => 30,
        ]);

        $response = $this->actingAs($this->admin)->putJson("/api/admin/doctor-schedules/{$schedule->id}", [
            'end_time' => '14:00',
            'is_active' => false,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.end_time', '14:00')
            ->assertJsonPath('data.is_active', false);
    }

    public function test_admin_can_delete_doctor_schedule(): void
    {
        $schedule = DoctorSchedule::create([
            'doctor_id' => $this->doctorProfile->id,
            'day_of_week' => 4,
            'start_time' => '09:00',
            'end_time' => '12:00',
            'slot_duration_minutes' => 30,
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/api/admin/doctor-schedules/{$schedule->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('doctor_schedules', ['id' => $schedule->id]);
    }

    public function test_non_admin_cannot_access_admin_doctor_schedules(): void
    {
        $patientRole = Role::create(['name' => Role::PATIENT]);
        $patient = User::factory()->create(['role_id' => $patientRole->id]);

        $response = $this->actingAs($patient)->getJson('/api/admin/doctor-schedules');

        $response->assertStatus(403);
    }
}
