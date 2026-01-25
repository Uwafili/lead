<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\updateTariffController;
use App\Http\Controllers\TariffController;


// Authenticated routes
Route::middleware("auth")->group(function(){
    Route::view('/', 'post.index')->name('home');
    Route::get('/consultation', [updateTariffController::class,'show'])->name('consultation'); 
    Route::view('/Service', 'follow.Service')->name('Service'); 


    Route::post('/logout',[AuthController::class,'logout'])->name('logout');

    Route::view("/logout",'logout')->name('logoutDemo');

Route::view('/updateTariff',"follow.updateTar")->name('updateTar');
Route::post('/UpdateTar',[updateTariffController::class,'index'])->name('UpdateTar');
Route::put('/UpdateSinTar',[updateTariffController::class,'Sin'])->name('UpdateSinTar');
 


});


Route::view('/register','Auth.register')->name('register');
Route::post('/register',[AuthController::class,'register'])->name('register.store');

// Guest routes
Route::middleware("guest")->group(function(){
    Route::view('/login','Auth.login')->name('login');
    Route::post('/login',[AuthController::class,'login'])->name('login.store'); // POST
    
    
    Route::get('/download-tariff', [TariffController::class, 'downloadFullTariff'])->name('tariff.download');
    
});

Route::middleware(["admin"])->group(function(){
        Route::get('/Admin/dashboard', [AuthController::class, 'adminDashboard'])->name('admin.dashboard');
        Route::delete('/Admin/users/{user}', [AuthController::class, 'deleteUser'])->name('admin.users.delete');
        Route::get('/Admin/tariff/{id?}', [AuthController::class, 'adminTar'])->name('admin.tariff');
        
Route::get('/export-tariffs-csv{id?}', [updateTariffController::class, 'exportTariffsCsv'])->name('tariffs.export');

// Route::post("/uploadFacilityExcel",[FacilityController::class,'uploadFacilityExcel'])->name('uploadFacilityExcel');

Route::get('users', [FacilityController::class, 'users'])->name('admin.users');



});