<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    private function transformRole(Role $role)
    {
        $roleArray = $role->toArray();
        $roleArray['permissions'] = $role->permissions->pluck('name')->toArray();
        return $roleArray;
    }

    public function index()
    {
        $roles = Role::with('permissions')->get();
        return $roles->map(fn($role) => $this->transformRole($role));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        if (!empty($validated['permissions'])) {
            $permissionIds = [];
            foreach ($validated['permissions'] as $permName) {
                // Ensure permission exists
                $permission = Permission::firstOrCreate(['name' => $permName]);
                $permissionIds[] = $permission->id;
            }
            $role->permissions()->sync($permissionIds);
        }

        return response()->json($this->transformRole($role->load('permissions')), 201);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'string|unique:roles,name,' . $role->id,
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
        ]);

        $role->update([
            'name' => $validated['name'] ?? $role->name,
            'description' => $validated['description'] ?? $role->description,
        ]);

        if (isset($validated['permissions'])) {
            $permissionIds = [];
            foreach ($validated['permissions'] as $permName) {
                $permission = Permission::firstOrCreate(['name' => $permName]);
                $permissionIds[] = $permission->id;
            }
            $role->permissions()->sync($permissionIds);
        }

        return response()->json($this->transformRole($role->load('permissions')));
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return response()->json(['message' => 'Role deleted successfully']);
    }
}
