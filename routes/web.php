<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Authenticated routes
Route::middleware("auth")->group(function(){
    Route::view('/', 'post.index')->name('home'); // Correct view name: posts.index
    Route::post('/logout',[AuthController::class,'logout'])->name('logout');


   
});


Route::view('/register','Auth.register')->name('register'); // Unique name for GET
Route::post('/register',[AuthController::class,'register'])->name('register'); // POST

// Guest routes
Route::middleware("guest")->group(function(){
    Route::view('/login','Auth.login')->name('login'); // Unique name for GET
    Route::post('/login',[AuthController::class,'login'])->name('login'); // POST
});

Route::middleware(["admin"])->group(function(){
     Route::get('/Admin/dashboard', [AuthController::class, 'adminDashboard'])->name('admin.dashboard');
     Route::delete('/Admin/users/{user}', [AuthController::class, 'deleteUser'])->name('admin.users.delete');
});