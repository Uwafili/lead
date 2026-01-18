<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TariffController extends Controller
{
    public function downloadFullTariff()
    {
        $csvFile = public_path('app/LEADWAY HEALTH TARIFF 8.csv');
        
        if (!file_exists($csvFile)) {
            return back()->with('error', 'Tariff file not found.');
        }

        $callback = function() use ($csvFile) {
            $file = fopen('php://output', 'w');
            
            if (!$file) {
                return;
            }
            
            $inputFile = fopen($csvFile, 'r');
            
            if (!$inputFile) {
                fclose($file);
                return;
            }
            
            // Skip first empty row and header rows
            fgetcsv($inputFile);
            fgetcsv($inputFile);
            fgetcsv($inputFile);
            
            // Write header to output
            fputcsv($file, ['CODE', 'SERVICE', 'CATEGORY', 'TARIFF']);
            
            // Copy data rows
            while (($row = fgetcsv($inputFile)) !== false) {
                if (!empty($row[0]) && count($row) >= 4) {
                    fputcsv($file, $row);
                }
            }
            
            fclose($inputFile);
            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="LEADWAY_HEALTH_TARIFF.csv"',
        ]);
    }
}