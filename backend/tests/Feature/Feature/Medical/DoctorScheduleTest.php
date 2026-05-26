<?php

namespace Tests\Feature\Feature\Medical;

use App\Models\DoctorProfile;
use App\Models\DoctorSchedule;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DoctorScheduleTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $doctorUser;
    protected $doctorProfile;

    protected function setUp(): void
    {
        parent::setUp();

        $adminRole = Role::create(['name' => Role::ADMIN]);
        $doctorRole = Role::create(['name' => Role::DOCTOR]);
        Role::create(['name' => Role::PATIENT]);

        $dept = \App\Models\Department::create(['name' => 'General']);
        $spec = \App\Models\Specialization::create([
            'name' => 'General',
            'department_id' => $dept->id
        ]);

        $this->admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role_id' => $adminRole->id
        ]);

        $this->doctorUser = User::create([
            'name' => 'Doctor',
            'email' => 'doctor@example.com',
            'password' => 'password',
            'role_id' => $doctorRole->id
        ]);

        $this->doctorProfile = DoctorProfile::create([
            'user_id' => $this->doctorUser->id,
            'department_id' => $dept->id,
            'specialization_id' => $spec->id,
            'consultation_price' => 100
        ]);
    }

    public function test_admin_can_view_all_schedules(): void
    {
        DoctorSchedule::create([
            'doctor_profile_id' => $this->doctorProfile->id,
            'day_of_week' => 1,
            'start_time' => '09:00',
            'end_time' => '17:00',
            'slot_duration_minutes' => 30
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/admin/schedules');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_admin_can_create_schedule(): void
    {
        $data = [
            'doctor_profile_id' => $this->doctorProfile->id,
            'day_of_week' => 2,
            'start_time' => '10:00',
            'end_time' => '18:00',
            'slot_duration_minutes' => 45,
            'is_active' => true
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/admin/schedules', $data);

        $response->assertStatus(201);
        $this->assertDatabaseHas('doctor_schedules', ['day_of_week' => 2]);
    }

    public function test_doctor_can_view_own_schedule(): void
    {
        DoctorSchedule::create([
            'doctor_profile_id' => $this->doctorProfile->id,
            'day_of_week' => 3,
            'start_time' => '08:00',
            'end_time' => '16:00',
            'slot_duration_minutes' => 30
        ]);

        $response = $this->actingAs($this->doctorUser)->getJson('/api/doctor/schedule');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_doctor_cannot_view_others_schedule_via_admin_route(): void
    {
        $response = $this->actingAs($this->doctorUser)->getJson('/api/admin/schedules');

        $response->assertStatus(403);
    }

    public function test_admin_can_update_schedule(): void
    {
        $schedule = DoctorSchedule::create([
            'doctor_profile_id' => $this->doctorProfile->id,
            'day_of_week' => 4,
            'start_time' => '09:00',
            'end_time' => '17:00',
            'slot_duration_minutes' => 30
        ]);

        $response = $this->actingAs($this->admin)->putJson("/api/admin/schedules/{$schedule->id}", [
            'doctor_profile_id' => $this->doctorProfile->id,
            'day_of_week' => 4,
            'start_time' => '09:00',
            'end_time' => '17:00',
            'slot_duration_minutes' => 60,
            'is_active' => false
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('doctor_schedules', [
            'id' => $schedule->id,
            'slot_duration_minutes' => 60,
            'is_active' => false
        ]);
    }
}
