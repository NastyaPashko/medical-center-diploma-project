<?php

namespace Tests\Feature\Medical;

use App\Models\Department;
use App\Models\Specialization;
use App\Models\MedicalService;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MedicalCatalogValidationTest extends TestCase
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

    public function test_department_validation_rules()
    {
        // Name required and unique
        Department::create(['name' => 'Existing Dept']);

        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/admin/departments', [
                'name' => 'Existing Dept'
            ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);

        // Name cannot be only spaces
        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/admin/departments', [
                'name' => '   '
            ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);

        // Max lengths
        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/admin/departments', [
                'name' => str_repeat('a', 101),
                'description' => str_repeat('b', 1001),
                'phone' => str_repeat('c', 31),
                'floor' => str_repeat('d', 21),
                'room_number' => str_repeat('e', 21),
            ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'description', 'phone', 'floor', 'room_number']);
    }

    public function test_specialization_validation_rules()
    {
        $dept = Department::create(['name' => 'Dept 1']);

        // Name required, dept_id required
        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/admin/specializations', []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'department_id']);

        // Unique within same department
        Specialization::create(['name' => 'Spec 1', 'department_id' => $dept->id]);
        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/admin/specializations', [
                'name' => 'Spec 1',
                'department_id' => $dept->id
            ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);

        // Allowed in DIFFERENT department
        $dept2 = Department::create(['name' => 'Dept 2']);
        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/admin/specializations', [
                'name' => 'Spec 1',
                'department_id' => $dept2->id
            ]);
        $response->assertStatus(201);
    }

    public function test_medical_service_validation_rules()
    {
        $dept = Department::create(['name' => 'Dept 1']);
        $spec = Specialization::create(['name' => 'Spec 1', 'department_id' => $dept->id]);

        // Price and duration rules
        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/admin/services', [
                'department_id' => $dept->id,
                'specialization_id' => $spec->id,
                'name' => 'Service 1',
                'price' => 100001,
                'duration_minutes' => 7, // Not divisible by 5
            ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['price', 'duration_minutes']);

        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/admin/services', [
                'department_id' => $dept->id,
                'specialization_id' => $spec->id,
                'name' => 'Service 1',
                'price' => -1,
                'duration_minutes' => 4, // Min 5
            ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['price', 'duration_minutes']);
    }

    public function test_business_rules_for_inactive_parents()
    {
        $inactiveDept = Department::create(['name' => 'Inactive Dept', 'is_active' => false]);

        // Cannot create specialization under inactive department
        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/admin/specializations', [
                'name' => 'New Spec',
                'department_id' => $inactiveDept->id
            ]);
        $response->assertStatus(400); // Exceptions in Controller return 400 with message
        $this->assertEquals('Cannot create specialization under inactive or non-existent department', $response->json('message'));

        $activeDept = Department::create(['name' => 'Active Dept', 'is_active' => true]);
        $inactiveSpec = Specialization::create(['name' => 'Inactive Spec', 'department_id' => $activeDept->id, 'is_active' => false]);

        // Cannot create service under inactive specialization
        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/admin/services', [
                'name' => 'New Service',
                'department_id' => $activeDept->id,
                'specialization_id' => $inactiveSpec->id,
                'price' => 100,
                'duration_minutes' => 30
            ]);
        $response->assertStatus(400);
        $this->assertEquals('Cannot create service under inactive or non-existent specialization', $response->json('message'));
    }

    public function test_specialization_must_belong_to_department()
    {
        $dept1 = Department::create(['name' => 'Dept 1']);
        $dept2 = Department::create(['name' => 'Dept 2']);
        $specInDept1 = Specialization::create(['name' => 'Spec 1', 'department_id' => $dept1->id]);

        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/admin/services', [
                'name' => 'Wrong Dept Service',
                'department_id' => $dept2->id,
                'specialization_id' => $specInDept1->id,
                'price' => 100,
                'duration_minutes' => 30
            ]);
        $response->assertStatus(400);
        $this->assertEquals('Specialization must belong to the selected department', $response->json('message'));
    }

    public function test_deactivation_instead_of_hard_delete()
    {
        $dept = Department::create(['name' => 'Dept with Spec']);
        $spec = Specialization::create(['name' => 'Spec', 'department_id' => $dept->id]);

        // Delete department that has specialization
        $response = $this->actingAs($this->adminUser)
            ->deleteJson("/api/admin/departments/{$dept->id}");

        $response->assertStatus(200);
        $this->assertDatabaseHas('departments', ['id' => $dept->id, 'is_active' => false]);

        // Delete service
        $service = MedicalService::create([
            'name' => 'Service',
            'department_id' => $dept->id,
            'specialization_id' => $spec->id,
            'price' => 100,
            'duration_minutes' => 30
        ]);

        $response = $this->actingAs($this->adminUser)
            ->deleteJson("/api/admin/services/{$service->id}");
        $response->assertStatus(200);
        $this->assertDatabaseHas('medical_services', ['id' => $service->id, 'is_active' => false]);
    }
}
