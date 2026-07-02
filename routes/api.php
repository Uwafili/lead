<?php

use Illuminate\Support\Facades\Route;
use App\Services\JsonSafetyService;

Route::get('/hospital-pharmacy', function () {

    $path = storage_path('app/Tariffs/Hospital.json');

    if (!file_exists($path)) {
        return response()->json([
            'error' => 'Hospital.json not found'
        ], 404);
    }

    $json = file_get_contents($path);

    $data = JsonSafetyService::decode($json);

    $validated = JsonSafetyService::validateArray($data);

    return response()->json([
        'data' => $validated['clean'],
        'bad' => $validated['bad']
    ]);
});

Route::get('/hospital-pharmacy-All', function () {

    $path = storage_path('app/Tariffs/Tar.json');

    if (!file_exists($path)) {
        return response()->json([
            'error' => 'Tar.json not found'
        ], 404);
    }

    $json = file_get_contents($path);

    $data = JsonSafetyService::decode($json);

    $validated = JsonSafetyService::validateArray($data);

    return response()->json([
        'data' => $validated['clean'],
        'bad' => $validated['bad']
    ]);
});