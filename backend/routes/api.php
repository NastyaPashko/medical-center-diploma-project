<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'currentUser']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin Routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        // Departments
        Route::apiResource('departments', \App\Http\Controllers\Api\Admin\AdminDepartmentController::class);

        // Specializations
        Route::apiResource('specializations', \App\Http\Controllers\Api\Admin\AdminSpecializationController::class);

        // Medical Services
        Route::apiResource('services', \App\Http\Controllers\Api\Admin\AdminMedicalServiceController::class);

        // Doctors
        Route::apiResource('doctors', \App\Http\Controllers\Api\Admin\AdminDoctorController::class);

        // Patients
        Route::get('patients', [\App\Http\Controllers\Api\Admin\AdminPatientController::class, 'index']);
        Route::get('patients/{id}', [\App\Http\Controllers\Api\Admin\AdminPatientController::class, 'show']);
        Route::put('patients/{id}', [\App\Http\Controllers\Api\Admin\AdminPatientController::class, 'update']);
    });
});

// Public/Patient Read-only Routes
Route::get('/departments', [\App\Http\Controllers\Api\DepartmentController::class, 'index']);
Route::get('/specializations', [\App\Http\Controllers\Api\SpecializationController::class, 'index']);
Route::get('/medical-services', [\App\Http\Controllers\Api\MedicalServiceController::class, 'index']);
Route::get('/doctors', [\App\Http\Controllers\Api\DoctorController::class, 'index']);
Route::get('/doctors/{id}', [\App\Http\Controllers\Api\DoctorController::class, 'show']);
