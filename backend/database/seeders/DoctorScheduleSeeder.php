<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\DoctorProfile;
use App\Models\DoctorSchedule;
use App\Models\Role;
use App\Models\Specialization;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DoctorScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $doctorRole = Role::where('name', Role::DOCTOR)->first();
        if (!$doctorRole) {
            $doctorRole = Role::create(['name' => Role::DOCTOR]);
        }

        $demoData = [
            [
                'name' => 'Dr. Sofia Melnyk',
                'email' => 'sofia.melnyk@example.com',
                'specialization' => 'Therapist',
                'department' => 'General Medicine',
                'schedules' => [
                    ['day' => 1, 'start' => '09:00', 'end' => '14:00', 'slot' => 30],
                    ['day' => 3, 'start' => '10:00', 'end' => '16:00', 'slot' => 30],
                    ['day' => 5, 'start' => '09:00', 'end' => '13:00', 'slot' => 30],
                ]
            ],
            [
                'name' => 'Dr. Andrii Kovalenko',
                'email' => 'andrii.kovalenko@example.com',
                'specialization' => 'Cardiologist',
                'department' => 'Cardiology',
                'schedules' => [
                    ['day' => 2, 'start' => '08:00', 'end' => '12:00', 'slot' => 30],
                    ['day' => 4, 'start' => '13:00', 'end' => '18:00', 'slot' => 30],
                ]
            ],
            [
                'name' => 'Dr. Olena Shevchenko',
                'email' => 'olena.shevchenko@example.com',
                'specialization' => 'Dentist',
                'department' => 'Stomatology',
                'schedules' => [
                    ['day' => 1, 'start' => '12:00', 'end' => '18:00', 'slot' => 45],
                    ['day' => 4, 'start' => '09:00', 'end' => '15:00', 'slot' => 45],
                ]
            ],
        ];

        foreach ($demoData as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password'),
                    'role_id' => $doctorRole->id,
                    'phone' => '+380' . rand(100000000, 999999999),
                ]
            );

            $department = Department::firstOrCreate(['name' => $data['department']], ['is_active' => true]);
            $specialization = Specialization::firstOrCreate(
                ['name' => $data['specialization']],
                ['department_id' => $department->id, 'is_active' => true]
            );

            $profile = DoctorProfile::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'department_id' => $department->id,
                    'specialization_id' => $specialization->id,
                    'is_available' => true,
                    'consultation_price' => 200,
                ]
            );

            foreach ($data['schedules'] as $sched) {
                DoctorSchedule::updateOrCreate(
                    [
                        'doctor_profile_id' => $profile->id,
                        'day_of_week' => $sched['day'],
                        'start_time' => $sched['start'],
                        'end_time' => $sched['end'],
                    ],
                    [
                        'slot_duration_minutes' => $sched['slot'],
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
