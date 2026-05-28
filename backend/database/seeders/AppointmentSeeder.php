<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Department;
use App\Models\DoctorProfile;
use App\Models\MedicalService;
use App\Models\PatientProfile;
use App\Models\Role;
use App\Models\Specialization;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Specializations and Services exist
        $this->seedSpecializationsAndServices();

        // 2. Ensure Patients exist
        $this->seedPatients();

        // 3. Seed Appointments
        $patients = PatientProfile::all();
        $doctors = DoctorProfile::all();
        $services = MedicalService::all();

        if ($patients->isEmpty() || $doctors->isEmpty() || $services->isEmpty()) {
            return;
        }

        $statuses = ['pending', 'confirmed', 'completed', 'cancelled'];

        // Today's appointments
        for ($i = 0; $i < 3; $i++) {
            Appointment::create([
                'patient_profile_id' => $patients->random()->id,
                'doctor_profile_id' => $doctors->random()->id,
                'medical_service_id' => $services->random()->id,
                'appointment_date' => Carbon::today()->toDateString(),
                'appointment_time' => sprintf('%02d:00:00', 9 + $i),
                'status' => 'confirmed',
            ]);
        }

        // Past and Future appointments
        for ($i = 0; $i < 10; $i++) {
            $date = Carbon::today()->addDays(rand(-5, 5));
            Appointment::create([
                'patient_profile_id' => $patients->random()->id,
                'doctor_profile_id' => $doctors->random()->id,
                'medical_service_id' => $services->random()->id,
                'appointment_date' => $date->toDateString(),
                'appointment_time' => sprintf('%02d:00:00', rand(8, 17)),
                'status' => $statuses[array_rand($statuses)],
            ]);
        }
    }

    private function seedSpecializationsAndServices()
    {
        $specs = [
            'General Medicine' => [
                'General Consultation' => ['duration' => 30, 'price' => 600],
                'Follow-up Consultation' => ['duration' => 30, 'price' => 450],
            ],
            'Cardiology' => [
                'Cardiology Consultation' => ['duration' => 45, 'price' => 900],
                'ECG' => ['duration' => 20, 'price' => 500],
            ],
            'Dermatology' => [
                'Dermatology Examination' => ['duration' => 30, 'price' => 700],
            ],
            'Pediatrics' => [
                'Pediatric Consultation' => ['duration' => 30, 'price' => 650],
            ],
            'Neurology' => [
                'Neurology Consultation' => ['duration' => 45, 'price' => 950],
            ],
        ];

        $dept = Department::firstOrCreate(['name' => 'General Medicine'], ['is_active' => true]);

        foreach ($specs as $specName => $services) {
            $specialization = Specialization::firstOrCreate(
                ['name' => $specName],
                ['department_id' => $dept->id, 'is_active' => true]
            );

            foreach ($services as $serviceName => $details) {
                MedicalService::firstOrCreate(
                    ['name' => $serviceName],
                    [
                        'department_id' => $dept->id,
                        'specialization_id' => $specialization->id,
                        'duration_minutes' => $details['duration'],
                        'price' => $details['price'],
                        'is_active' => true,
                    ]
                );
            }
        }
    }

    private function seedPatients()
    {
        $patientRole = Role::where('name', Role::PATIENT)->first();
        if (!$patientRole) {
            $patientRole = Role::create(['name' => Role::PATIENT]);
        }

        $patientsData = [
            ['name' => 'Ivan Ivanov', 'email' => 'ivan@example.com'],
            ['name' => 'Maria Petrenko', 'email' => 'maria@example.com'],
            ['name' => 'Oleg Sydorenko', 'email' => 'oleg@example.com'],
            ['name' => 'Anna Koval', 'email' => 'anna@example.com'],
            ['name' => 'Dmytro Shevchenko', 'email' => 'dmytro@example.com'],
        ];

        foreach ($patientsData as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password'),
                    'role_id' => $patientRole->id,
                    'phone' => '+380' . rand(100000000, 999999999),
                ]
            );

            PatientProfile::firstOrCreate(['user_id' => $user->id]);
        }
    }
}
