<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = config('roles.list', []);

        foreach ($roles as $roleName) {
            \App\Models\Role::firstOrCreate(['name' => $roleName]);
        }
    }
}
