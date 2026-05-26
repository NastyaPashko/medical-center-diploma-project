<?php

use App\Http\Controllers\Api\Admin\AdminDepartmentController;
use App\Http\Controllers\Api\Admin\AdminDoctorController;
use App\Http\Controllers\Api\Admin\AdminDoctorScheduleController;
use App\Http\Controllers\Api\Admin\AdminMedicalServiceController;
use App\Http\Controllers\Api\Admin\AdminPatientController;
use App\Http\Controllers\Api\Admin\AdminProfileController;
use App\Http\Controllers\Api\Admin\AdminSpecializationController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\DoctorProfileController;
use App\Http\Controllers\Api\DoctorScheduleController;
use App\Http\Controllers\Api\MedicalServiceController;
use App\Http\Controllers\Api\Patient\PatientProfileController;
use App\Http\Controllers\Api\SpecializationController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'currentUser']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Patient Profile
    Route::get('/patient/profile', [PatientProfileController::class, 'show']);
    Route::put('/patient/profile', [PatientProfileController::class, 'update']);

    // Doctor Profile
    Route::get('/doctor/profile', [DoctorProfileController::class, 'show']);
    Route::put('/doctor/profile', [DoctorProfileController::class, 'update']);

    // Doctor Schedule
    Route::get('/doctor/schedule', [DoctorScheduleController::class, 'index']);

    // Admin Routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        // Profile
        Route::get('profile', [AdminProfileController::class, 'show']);
        Route::put('profile', [AdminProfileController::class, 'update']);

        // Departments
        Route::apiResource('departments', AdminDepartmentController::class);

        // Specializations
        Route::apiResource('specializations', AdminSpecializationController::class);

        // Medical Services
        Route::apiResource('services', AdminMedicalServiceController::class);

        // Doctors
        Route::apiResource('doctors', AdminDoctorController::class);

        // Schedules
        Route::apiResource('schedules', AdminDoctorScheduleController::class);

        // Patients
        Route::get('patients', [AdminPatientController::class, 'index']);
        Route::get('patients/{id}', [AdminPatientController::class, 'show']);
        Route::put('patients/{id}', [AdminPatientController::class, 'update']);

        // Users (for assignment)
        Route::get('users', [AdminUserController::class, 'index']);
    });
});

// Public/Patient Read-only Routes
Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/specializations', [SpecializationController::class, 'index']);
Route::get('/medical-services', [MedicalServiceController::class, 'index']);
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{id}', [DoctorController::class, 'show']);
