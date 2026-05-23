<?php

namespace Tests\Feature\Medical;

use App\Models\Department;
use App\Models\Specialization;
use App\Models\MedicalService;
use App\Models\DoctorProfile;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicMedicalCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_list_active_departments()
    {
        Department::create(['name' => 'Active Dept', 'is_active' => true]);
        Department::create(['name' => 'Inactive Dept', 'is_active' => false]);

        $response = $this->getJson('/api/departments');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Active Dept');
    }

    public function test_can_filter_specializations_by_department()
    {
        $dept1 = Department::create(['name' => 'Dept 1', 'is_active' => true]);
        $dept2 = Department::create(['name' => 'Dept 2', 'is_active' => true]);

        Specialization::create(['name' => 'Spec 1', 'department_id' => $dept1->id, 'is_active' => true]);
        Specialization::create(['name' => 'Spec 2', 'department_id' => $dept2->id, 'is_active' => true]);

        $response = $this->getJson("/api/specializations?department_id={$dept1->id}");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Spec 1');
    }

    public function test_can_filter_doctors_by_name_and_department()
    {
        $role = Role::create(['name' => Role::DOCTOR]);
        $dept = Department::create(['name' => 'General', 'is_active' => true]);
        $spec = Specialization::create(['name' => 'Generalist', 'department_id' => $dept->id, 'is_active' => true]);

        $user1 = User::create(['name' => 'Dr. Smith', 'email' => 'smith@example.com', 'password' => 'pass', 'role_id' => $role->id]);
        DoctorProfile::create([
            'user_id' => $user1->id,
            'department_id' => $dept->id,
            'specialization_id' => $spec->id,
            'consultation_price' => 100,
            'is_available' => true
        ]);

        $user2 = User::create(['name' => 'Dr. Jones', 'email' => 'jones@example.com', 'password' => 'pass', 'role_id' => $role->id]);
        DoctorProfile::create([
            'user_id' => $user2->id,
            'department_id' => $dept->id,
            'specialization_id' => $spec->id,
            'consultation_price' => 100,
            'is_available' => true
        ]);

        $response = $this->getJson('/api/doctors?name=Smith');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.user.name', 'Dr. Smith');
    }
}
