<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Admintariffname;


class TariffController extends Controller
{
   /*  public function downloadFullTariff()
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
    } */


   //Admin Tariff Upload
   
   public function AddTariff(Request $request){

   $request->validate(['file' => 'required|file|max:5120','type'=>'required']);

        $file = $request->file('file');

        $spreadsheet = IOFactory::load($file->getPathname());

        $result=[];
        
        foreach($spreadsheet->getWorksheetIterator() as $worksheet) { 
            $sheetName=$worksheet->getTitle();

            $rows=$worksheet->toArray();

            $header=array_shift($rows);

            $formattedRows=[];

            foreach ($rows as $row) {
                  $formattedRows[] = array_combine($header, $row);
            }

            $result[$sheetName]=$formattedRows;
        }

        $json=json_encode($result, JSON_PRETTY_PRINT);

          $fileName = $request['type']. '.json';

        file_put_contents(storage_path("app/$fileName"), $json);

        Admintariffname::create([
            "Admin_id"=>auth()->id(),
            "name"=>$request->type
        ]);
      return redirect()->route('Ad_ViewTariff')->with('success', 'Tariff submitted successfully!');

   }
    

   public function showAdTar()  {
        $names=Admintariffname::where('Admin_id',auth()->id())->get();
        return view('Admin.Tariff.ViewTariff',compact('names'));
   }
}