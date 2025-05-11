<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\PostController;

// Public routes
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

// Routes accessibles sans authentification
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Logout route
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    
    // Post routes
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
    Route::get('/my-posts', [PostController::class, 'myPosts']);
}
);

    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::get('/applications/check/{postId}', [ApplicationController::class, 'checkApplicationStatus']);
    Route::get('/my-applications', [ApplicationController::class, 'myApplications']);
    Route::get('/received-applications', [ApplicationController::class, 'receivedApplications']);
    Route::put('/applications/{id}/status', [ApplicationController::class, 'updateStatus']);