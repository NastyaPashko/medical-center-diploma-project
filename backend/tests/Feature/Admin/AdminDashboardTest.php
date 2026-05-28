<?php

namespace Tests\Feature\Admin;

use App\Models\Appointment;
use App\Models\DoctorProfile;
use App\Models\PatientProfile;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $doctor;

    protected function setUp(): void
    {
        parent::setUp();

        $adminRole = Role::create(['name' => Role::ADMIN]);
        $doctorRole = Role::create(['name' => Role::DOCTOR]);
        $patientRole = Role::create(['name' => Role::PATIENT]);

        $this->admin = User::factory()->create(['role_id' => $adminRole->id]);
        $this->doctor = User::factory()->create(['role_id' => $doctorRole->id]);
    }

    public function test_admin_can_access_dashboard_stats()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/admin/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'stats' => [
                    'total_doctors',
                    'total_patients',
                    'total_appointments',
                    'today_appointments',
                    'active_services',
                    'active_specializations',
                ],
                'latest_appointments',
                'latest_patients',
                'doctors_by_specialization',
            ]);
    }

    public function test_non_admin_cannot_access_dashboard()
    {
        $response = $this->actingAs($this->doctor)->getJson('/api/admin/dashboard');

        $response->assertStatus(403);
    }
}
