<?php

namespace Tests\Feature\Doctor;

use App\Models\Department;
use App\Models\DoctorProfile;
use App\Models\DoctorSchedule;
use App\Models\Role;
use App\Models\Specialization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DoctorScheduleTest extends TestCase
{
    use RefreshDatabase;

    protected User $doctorUser;
    protected DoctorProfile $doctorProfile;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => Role::ADMIN]);
        $doctorRole = Role::create(['name' => Role::DOCTOR]);

        $this->doctorUser = User::factory()->create([
            'role_id' => $doctorRole->id,
        ]);

        $department = Department::create(['name' => 'Cardiology', 'is_active' => true]);
        $specialization = Specialization::create([
            'name' => 'Cardiologist',
            'department_id' => $department->id,
            'is_active' => true,
        ]);

        $this->doctorProfile = DoctorProfile::create([
            'user_id' => $this->doctorUser->id,
            'department_id' => $department->id,
            'specialization_id' => $specialization->id,
            'consultation_price' => 100,
        ]);
    }

    public function test_doctor_can_view_own_schedule(): void
    {
        DoctorSchedule::create([
            'doctor_id' => $this->doctorProfile->id,
            'day_of_week' => 1,
            'start_time' => '09:00',
            'end_time' => '17:00',
            'slot_duration_minutes' => 30,
            'is_active' => true,
        ]);

        DoctorSchedule::create([
            'doctor_id' => $this->doctorProfile->id,
            'day_of_week' => 2,
            'start_time' => '10:00',
            'end_time' => '14:00',
            'slot_duration_minutes' => 15,
            'is_active' => false,
        ]);

        $response = $this->actingAs($this->doctorUser)->getJson('/api/doctor/schedule');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_doctor_without_profile_gets_not_found(): void
    {
        $doctorRole = Role::where('name', Role::DOCTOR)->first();
        $userWithoutProfile = User::factory()->create(['role_id' => $doctorRole->id]);

        $response = $this->actingAs($userWithoutProfile)->getJson('/api/doctor/schedule');

        $response->assertStatus(404);
    }

    public function test_patient_cannot_access_doctor_schedule_endpoint(): void
    {
        $patientRole = Role::create(['name' => Role::PATIENT]);
        $patient = User::factory()->create(['role_id' => $patientRole->id]);

        $response = $this->actingAs($patient)->getJson('/api/doctor/schedule');

        $response->assertStatus(403);
    }
}
