<?php

namespace App\Http\Middleware;

use App\Models\Role;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DoctorMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || $request->user()->role->name !== Role::DOCTOR) {
            return response()->json(['message' => 'Unauthorized. Doctor access required.'], 403);
        }

        return $next($request);
    }
}
