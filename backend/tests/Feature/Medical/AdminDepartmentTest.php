<?php

namespace Tests\Feature\Medical;

use App\Models\Department;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDepartmentTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $adminRole = Role::create(['name' => Role::ADMIN]);
        $this->adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role_id' => $adminRole->id,
        ]);
    }

    public function test_admin_can_list_departments()
    {
        Department::create(['name' => 'Cardiology', 'is_active' => true]);
        Department::create(['name' => 'Neurology', 'is_active' => false]);

        $response = $this->actingAs($this->adminUser)
            ->getJson('/api/admin/departments');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_admin_can_create_department()
    {
        $data = [
            'name' => 'Pediatrics',
            'description' => 'Children healthcare',
            'is_active' => true
        ];

        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/admin/departments', $data);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Pediatrics');

        $this->assertDatabaseHas('departments', ['name' => 'Pediatrics']);
    }

    public function test_admin_can_update_department()
    {
        $department = Department::create(['name' => 'Old Name']);

        $response = $this->actingAs($this->adminUser)
            ->putJson("/api/admin/departments/{$department->id}", [
                'name' => 'New Name'
            ]);

        $response->assertStatus(200);
        $this->assertEquals('New Name', $department->fresh()->name);
    }

    public function test_admin_can_delete_department()
    {
        $department = Department::create(['name' => 'To Delete']);

        $response = $this->actingAs($this->adminUser)
            ->deleteJson("/api/admin/departments/{$department->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('departments', ['id' => $department->id]);
    }

    public function test_non_admin_cannot_access_admin_departments()
    {
        $patientRole = Role::create(['name' => Role::PATIENT]);
        $patientUser = User::create([
            'name' => 'Patient User',
            'email' => 'patient@example.com',
            'password' => 'password',
            'role_id' => $patientRole->id,
        ]);

        $response = $this->actingAs($patientUser)
            ->getJson('/api/admin/departments');

        $response->assertStatus(403);
    }
}
