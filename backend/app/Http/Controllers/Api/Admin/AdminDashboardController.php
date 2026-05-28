<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\DoctorProfile;
use App\Models\MedicalService;
use App\Models\PatientProfile;
use App\Models\Specialization;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

use Illuminate\Support\Facades\Log;
use Throwable;

class AdminDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $today = Carbon::today()->toDateString();

            $stats = [
                'total_doctors' => $this->safeCount(DoctorProfile::class),
                'total_patients' => $this->safeCount(PatientProfile::class),
                'total_appointments' => $this->safeCount(Appointment::class),
                'today_appointments' => $this->safeCount(Appointment::class, [['appointment_date', '=', $today]]),
                'active_services' => $this->safeCount(MedicalService::class, [['is_active', '=', true]]),
                'active_specializations' => $this->safeCount(Specialization::class, [['is_active', '=', true]]),
            ];

            $latestAppointments = [];
            try {
                $latestAppointments = Appointment::with(['patient.user', 'doctor.user', 'service'])
                    ->orderBy('appointment_date', 'desc')
                    ->orderBy('appointment_time', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(function ($appointment) {
                        return [
                            'id' => $appointment->id,
                            'patient_name' => $appointment->patient->user->name ?? 'N/A',
                            'doctor_name' => $appointment->doctor->user->name ?? 'N/A',
                            'service_name' => $appointment->service->name ?? 'N/A',
                            'appointment_date' => $appointment->appointment_date,
                            'appointment_time' => $appointment->appointment_time,
                            'status' => $appointment->status,
                        ];
                    });
            } catch (Throwable $e) {
                Log::warning('Failed to fetch latest appointments for dashboard: ' . $e->getMessage());
            }

            $latestPatients = [];
            try {
                $latestPatients = PatientProfile::with('user')
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(function ($profile) {
                        return [
                            'id' => $profile->id,
                            'name' => $profile->user->name ?? 'N/A',
                            'email' => $profile->user->email ?? 'N/A',
                            'phone' => $profile->user->phone ?? 'N/A',
                            'registration_date' => $profile->created_at->toDateTimeString(),
                        ];
                    });
            } catch (Throwable $e) {
                Log::warning('Failed to fetch latest patients for dashboard: ' . $e->getMessage());
            }

            $doctorsBySpecialization = [];
            try {
                $doctorsBySpecialization = Specialization::withCount('doctorProfiles')
                    ->get()
                    ->map(function ($spec) {
                        return [
                            'name' => $spec->name,
                            'count' => $spec->doctor_profiles_count,
                        ];
                    });
            } catch (Throwable $e) {
                Log::warning('Failed to fetch doctors by specialization for dashboard: ' . $e->getMessage());
            }

            return response()->json([
                'stats' => $stats,
                'latest_appointments' => $latestAppointments,
                'latest_patients' => $latestPatients,
                'doctors_by_specialization' => $doctorsBySpecialization,
            ]);
        } catch (Throwable $e) {
            Log::error('Dashboard data fetch error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to load dashboard data.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function safeCount($modelClass, array $where = []): int
    {
        try {
            $query = $modelClass::query();
            if (!empty($where)) {
                $query->where($where);
            }
            return $query->count();
        } catch (Throwable $e) {
            Log::warning("Failed to count {$modelClass}: " . $e->getMessage());
            return 0;
        }
    }
}
