<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::with(['parent', 'children']);

        // Get only parent categories if requested
        if ($request->has('parents_only') && $request->parents_only) {
            $query->whereNull('parent_id');
        }

        // Search filter
        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $categories = $query->orderBy('name')->get();

        // Add items count
        $categories->each(function ($category) {
            $category->items_count = $category->items()->count();
        });

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($validated);

        return response()->json($category->load('parent'), 201);
    }

    public function show(Category $category)
    {
        return response()->json($category->load(['parent', 'children', 'items']));
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id|not_in:' . $category->id,
            'description' => 'nullable|string',
        ]);

        // Prevent circular reference
        if ($validated['parent_id'] ?? null) {
            $parent = Category::find($validated['parent_id']);
            if ($parent && $parent->parent_id === $category->id) {
                return response()->json([
                    'message' => 'Cannot set child category as parent'
                ], 422);
            }
        }

        $category->update($validated);

        return response()->json($category->load('parent'));
    }

    public function destroy(Category $category)
    {
        // Check if category has items
        if ($category->items()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with existing items'
            ], 422);
        }

        // Check if category has children
        if ($category->children()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with sub-categories'
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }

    // Get category tree structure
    public function tree()
    {
        $categories = Category::whereNull('parent_id')
            ->with(['children' => function ($query) {
                $query->withCount('items');
            }])
            ->withCount('items')
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }
}
