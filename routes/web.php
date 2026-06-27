<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\updateTariffController;
use App\Http\Controllers\TariffController;


// Authenticated routes
Route::middleware("auth")->group(function(){
    Route::get('/CategoryView',[updateTariffController::class,'CategoryView'])->name('CategoryView');
    Route::get('/currTarView/',[updateTariffController::class,'currTarView'])->name('currTarView');
    Route::get('/TariffNeg', [updateTariffController::class,'showTariffNeg'])->name('TariffNeg'); 
    Route::view('/Service', 'follow.Service')->name('Service'); 
    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
    Route::post('/chat/message', [ChatController::class, 'sendMessage'])->name('chat.send');
    Route::post('/chat/mark-read', [ChatController::class, 'markRead'])->name('chat.markread');

    Route::post('/logout',[AuthController::class,'logout'])->name('logout');

    Route::view("/logout",'logout')->name('logoutDemo');

Route::view('/updateTariff',"Facility.updateTar")->name('updateTar');
Route::post('/UpdateTar',[updateTariffController::class,'index'])->name('UpdateTar');
Route::put('/UpdateSinTar',[updateTariffController::class,'Sin'])->name('UpdateSinTar');
 
Route::put('/updatePrice',[updateTariffController::class,'updatePrice'])->name('updatePrice');
 

});

//Register
Route::view('/register','Auth.register')->name('register');
Route::post('/register',[AuthController::class,'register'])->name('register.store');


Route::view('/','post.index')->name('home');
// Guest routes
Route::middleware("guest")->group(function(){
    Route::view('/login','Auth.login')->name('login');
    Route::get('/forgot-password',[AuthController::class,'showForgotPasswordForm'])->name('password.request');
    Route::post('/forgot-password',[AuthController::class,'resetPassword'])->name('password.update');
    Route::post('/login',[AuthController::class,'login'])->name('login.store'); // POST
    Route::get('/download-tariff', [TariffController::class, 'downloadFullTariff'])->name('tariff.download');
    
});


//Admin
Route::middleware(["admin"])->group(function(){
        Route::get('/Admin/dashboard', [AuthController::class, 'adminDashboard'])->name('admin.dashboard');
        Route::delete('/Admin/users/{user}', [AuthController::class, 'deleteUser'])->name('admin.users.delete');
        Route::get('/Admin/tariff/{id?}', [updateTariffController::class, 'AdminTarViewNeg'])->name('AdminTarViewNeg');
        
        Route::post("/uploadFacilityExcel",[FacilityController::class,'uploadFacilityExcel'])->name('uploadFacilityExcel');
        Route::get('/Admin/users', [AuthController::class, 'show'])->name('admin.users');
        Route::get('/export-tariffs-csv/{id?}', [updateTariffController::class, 'exportTariffsCsv'])->name('tariffs.export');
        Route::post("/uploadFacilityExcel",[FacilityController::class,'uploadFacilityExcel'])->name('uploadFacilityExcel');

        Route::view("/addFacility",'Admin.AddUser')->name('addFacility');
        // Route::get('/users', [FacilityController::class,'getUsers'])->name('admin.users');

        // Route::get('/', [FacilityController::class, 'users'])->name('admin.users');

//Tariff Controller

        //Upload tariff
        Route::view("/Tariff/AddTariff",'Admin.Tariff.AddTariff')->name("Ad_AddTariff");
        Route::post("/Tariff/AddTariff",[TariffController::class, 'AddTariff'])->name("Post_Ad_AddTariff");
        Route::get("/Tariff/ViewTariff",[TariffController::class,'showAdTar'])->name('Ad_ViewTariff');
      
        });

        // Excel/Tariff endpoints
        Route::get('/excel/{category}', [TariffController::class, 'getExcelData'])->name('excel.tariff');

          // getting Tariff

     
