<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Roles
        $adminRole = Role::create([
            'name' => 'admin',
            'description' => 'Administrator with full system access'
        ]);

        $salesRole = Role::create([
            'name' => 'salesperson',
            'description' => 'Sales staff'
        ]);

        // 2. Permissions (Initial)
        $perms = [
            'dashboard.view',
            'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.delete',
            'sales.view', 'sales.create', 'sales.edit', 'sales.delete',
            'management.view', 'reports.view'
        ];

        foreach ($perms as $p) {
            $permission = Permission::create(['name' => $p]);
            $adminRole->permissions()->attach($permission);
            if (str_starts_with($p, 'sales.')) {
                $salesRole->permissions()->attach($permission);
            }
        }

        // 3. Users
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@erp.com',
            'password' => Hash::make('password'),
        ]);
        $admin->roles()->attach($adminRole);

        $salesperson = User::create([
            'name' => 'Sales Person 1',
            'email' => 'sales@erp.com',
            'password' => Hash::make('password'),
        ]);
        $salesperson->roles()->attach($salesRole);
    }
}
