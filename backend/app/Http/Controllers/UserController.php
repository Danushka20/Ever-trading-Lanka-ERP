<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    // List all users
    public function index()
    {
        return User::with('roles')->get();
    }

    // Create a new user (admin function)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'roles' => 'array', // List of role names or IDs
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Assign Roles
        if ($request->has('roles')) {
            $roleIds = Role::whereIn('name', (array)$request->roles)->pluck('id');
            $user->roles()->sync($roleIds);
        }

        return response()->json($user->load('roles'), 201);
    }

    // Update user details
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:8',
            'roles' => 'array',
        ]);

        $userData = [
            'name' => $validated['name'] ?? $user->name,
            'email' => $validated['email'] ?? $user->email,
        ];

        if (!empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $user->update($userData);

        if ($request->has('roles')) {
            $roleIds = Role::whereIn('name', (array)$request->roles)->pluck('id');
            $user->roles()->sync($roleIds);
        }

        return response()->json($user->load('roles'));
    }

    // Delete user
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    // Assign Role (Separate method if needed)
    public function assignRole(Request $request, User $user)
    {
        $request->validate(['role_id' => 'required|exists:roles,id']);
        $user->roles()->attach($request->role_id);
        return response()->json(['message' => 'Role assigned successfully', 'user' => $user->load('roles')]);
    }

    // Remove Role
    public function removeRole(Request $request, User $user)
    {
        $request->validate(['role_id' => 'required|exists:roles,id']);
        $user->roles()->detach($request->role_id);
        return response()->json(['message' => 'Role removed successfully', 'user' => $user->load('roles')]);
    }
}
