<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SalesAreaController;
use App\Http\Controllers\SalesTargetController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockBatchController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\CreditorController;
use App\Http\Controllers\BankAccountController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DealerController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\SettingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function() {
    return response()->json(['message' => 'API is working']);
});

// Public Authentication Routes
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);

// Public Asset Routes (no authentication needed)
Route::get('/company-logo', [SettingController::class, 'getLogo']);

Route::middleware('auth:sanctum')->group(function(){

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard/stats', [DashboardController::class, 'index']);

    // Sales Area
    Route::apiResource('sales-areas', SalesAreaController::class);

    // Dealers
    Route::apiResource('dealers', DealerController::class);

    // Suppliers
    Route::apiResource('suppliers', SupplierController::class);

    // Purchase
    Route::apiResource('purchases', PurchaseController::class);

    // Stock
    Route::get('stock', [StockController::class, 'index']);
    Route::get('stock/summary', [StockController::class, 'summary']);

    // Sales Target
    Route::get('sales-targets/report', [SalesTargetController::class,'achievement']);
    Route::apiResource('sales-targets', SalesTargetController::class);

    // Products
    Route::apiResource('products', ProductController::class);

    // Stock Batch
    Route::apiResource('stock-batches', StockBatchController::class);
    Route::post('stock-batches/reduce', [StockBatchController::class,'reduceStock']);

    // Invoices
    Route::apiResource('invoices', InvoiceController::class);
    Route::get('invoices-pending', [InvoiceController::class,'pending']);
    Route::get('invoices-confirmed', [InvoiceController::class,'confirmed']);

    // Creditors
    Route::apiResource('creditors', CreditorController::class);

    // Bank Accounts
    Route::apiResource('bank-accounts', BankAccountController::class);

    // Reports
    Route::get('reports/sales', [ReportController::class,'salesReport']);
    Route::get('reports/profit-loss', [ReportController::class,'profitLossReport']);

    // Items
    Route::apiResource('items', ItemController::class);

    // Categories
    Route::get('categories/tree', [CategoryController::class, 'tree']);
    Route::apiResource('categories', CategoryController::class);

    // Company Settings
    Route::get('/company-info', [SettingController::class, 'getCompanyInfo']);
    Route::post('/company-info', [SettingController::class, 'updateCompanyInfo']);

    // Units
    Route::apiResource('units', UnitController::class);

    // Users & Roles (RBAC)
    Route::apiResource('users', UserController::class);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('permissions', PermissionController::class);
});
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']); // Need to implement

// Protected Routes (Require Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Admin / User Management Routes
    // Ideally user management would require specific roles/permissions
    Route::apiResource('users', UserController::class);
    Route::post('/users/{user}/assign-role', [UserController::class, 'assignRole']);
    Route::post('/users/{user}/remove-role', [UserController::class, 'removeRole']);

    // ... Existing routes from previous implementation if any were here?
    // Oh wait, previous steps didn't add other routes yet (Item, Sale, etc), just the file was almost empty
    // I should create routes for Items, Sales, etc later, but focusing on user management now.
});

// Since earlier steps didn't add other routes (except generic /user),
// I assume I need to add them here or leave placeholders.
// The user asked for "login create and user managemnet create the with back end".
// I will stick to user/auth for now.

