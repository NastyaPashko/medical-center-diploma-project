<?php

namespace Tests\Feature\Patient;

use App\Models\Department;
use App\Models\DoctorProfile;
use App\Models\Role;
use App\Models\Specialization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DoctorListTest extends TestCase
{
    use RefreshDatabase;

    protected Department $department;
    protected Specialization $specialization;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => Role::DOCTOR]);

        $this->department = Department::create(['name' => 'Cardiology']);
        $this->specialization = Specialization::create([
            'name' => 'Cardiologist',
            'department_id' => $this->department->id
        ]);
    }

    public function test_patient_can_list_available_doctors(): void
    {
        $doctorUser1 = User::factory()->create(['name' => 'Dr. Smith', 'role_id' => Role::where('name', Role::DOCTOR)->first()->id]);
        DoctorProfile::create([
            'user_id' => $doctorUser1->id,
            'department_id' => $this->department->id,
            'specialization_id' => $this->specialization->id,
            'consultation_price' => 100,
            'is_available' => true,
        ]);

        $doctorUser2 = User::factory()->create(['name' => 'Dr. Jones', 'role_id' => Role::where('name', Role::DOCTOR)->first()->id]);
        DoctorProfile::create([
            'user_id' => $doctorUser2->id,
            'department_id' => $this->department->id,
            'specialization_id' => $this->specialization->id,
            'consultation_price' => 120,
            'is_available' => false,
        ]);

        $response = $this->getJson('/api/doctors');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.user.name', 'Dr. Smith');
    }

    public function test_patient_can_filter_doctors_by_department(): void
    {
        $dept2 = Department::create(['name' => 'Neurology']);
        $spec2 = Specialization::create(['name' => 'Neurologist', 'department_id' => $dept2->id]);

        $doctorUser1 = User::factory()->create(['role_id' => Role::where('name', Role::DOCTOR)->first()->id]);
        DoctorProfile::create([
            'user_id' => $doctorUser1->id,
            'department_id' => $this->department->id,
            'specialization_id' => $this->specialization->id,
            'consultation_price' => 100,
        ]);

        $doctorUser2 = User::factory()->create(['role_id' => Role::where('name', Role::DOCTOR)->first()->id]);
        DoctorProfile::create([
            'user_id' => $doctorUser2->id,
            'department_id' => $dept2->id,
            'specialization_id' => $spec2->id,
            'consultation_price' => 150,
        ]);

        $response = $this->getJson("/api/doctors?department_id={$dept2->id}");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.department_id', $dept2->id);
    }

    public function test_patient_can_filter_doctors_by_specialization(): void
    {
        $spec2 = Specialization::create(['name' => 'Surgeon', 'department_id' => $this->department->id]);

        $doctorUser1 = User::factory()->create(['role_id' => Role::where('name', Role::DOCTOR)->first()->id]);
        DoctorProfile::create([
            'user_id' => $doctorUser1->id,
            'department_id' => $this->department->id,
            'specialization_id' => $this->specialization->id,
            'consultation_price' => 100,
        ]);

        $doctorUser2 = User::factory()->create(['role_id' => Role::where('name', Role::DOCTOR)->first()->id]);
        DoctorProfile::create([
            'user_id' => $doctorUser2->id,
            'department_id' => $this->department->id,
            'specialization_id' => $spec2->id,
            'consultation_price' => 150,
        ]);

        $response = $this->getJson("/api/doctors?specialization_id={$spec2->id}");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.specialization_id', $spec2->id);
    }

    public function test_patient_can_filter_doctors_by_name(): void
    {
        $doctorUser1 = User::factory()->create(['name' => 'John Doe', 'role_id' => Role::where('name', Role::DOCTOR)->first()->id]);
        DoctorProfile::create([
            'user_id' => $doctorUser1->id,
            'department_id' => $this->department->id,
            'specialization_id' => $this->specialization->id,
            'consultation_price' => 100,
        ]);

        $doctorUser2 = User::factory()->create(['name' => 'Jane Smith', 'role_id' => Role::where('name', Role::DOCTOR)->first()->id]);
        DoctorProfile::create([
            'user_id' => $doctorUser2->id,
            'department_id' => $this->department->id,
            'specialization_id' => $this->specialization->id,
            'consultation_price' => 150,
        ]);

        $response = $this->getJson("/api/doctors?name=Jane");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.user.name', 'Jane Smith');
    }

    public function test_patient_can_view_doctor_details(): void
    {
        $doctorUser = User::factory()->create(['role_id' => Role::where('name', Role::DOCTOR)->first()->id]);
        $doctorProfile = DoctorProfile::create([
            'user_id' => $doctorUser->id,
            'department_id' => $this->department->id,
            'specialization_id' => $this->specialization->id,
            'consultation_price' => 100,
            'bio' => 'Dr Bio',
        ]);

        $response = $this->getJson("/api/doctors/{$doctorProfile->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.bio', 'Dr Bio');
    }

    public function test_patient_cannot_view_unavailable_doctor_details(): void
    {
        $doctorUser = User::factory()->create(['role_id' => Role::where('name', Role::DOCTOR)->first()->id]);
        $doctorProfile = DoctorProfile::create([
            'user_id' => $doctorUser->id,
            'department_id' => $this->department->id,
            'specialization_id' => $this->specialization->id,
            'consultation_price' => 100,
            'is_available' => false,
        ]);

        $response = $this->getJson("/api/doctors/{$doctorProfile->id}");

        $response->assertStatus(404);
    }
}
