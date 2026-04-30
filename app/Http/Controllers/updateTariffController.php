<?php

namespace App\Http\Controllers;

use App\Models\PendingTariff;
use App\Models\Tariff;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\DB;
class updateTariffController extends Controller
{
   public function index(Request $request){
     $request->validate([
        'file' => 'required|file|max:5120', 
        'type' =>'required'
    ]);
    $file=$request->file('file');

    $spreadSheet=IOFactory::load($file->getPathname());
     
    $sheets = $spreadSheet->getAllSheets();

    DB::transaction (function () use ($sheets,$request) {

    foreach ($sheets as $workSheet) {
       $sheetName=$workSheet->getTitle();
       $rows=$workSheet->toArray();
         foreach ($rows as $index => $row) {

                // Skip header row
                if ($index == 0) continue;

                if (empty($row[1])|| null) {
                   $row[1]='';
                }
            if (empty($row[0])|| null) {
                            $row[0]='';
                            }

                DB::table('tariffs')->insert([
                     'user_id'=>auth()->id(),
                    'SERVICE'  => $row[0],
                    'TARIFF' => $row[1],
                    'category' =>$sheetName,
                    'tariff_Type' =>$request->type,
                    'Edited_Service' =>'',
                    'Edited_Tariff' =>'',
                    'Negotiated' =>'',
                    'Mapped'  =>'',
                    'score'  =>'',
                    'code' =>''

                ]);
                 
         }
    }

    });
 PendingTariff::create([
                        'user_id'=>auth()->id(),
                        'user_name'=>Auth::user()->name,
                     ]);
     return redirect()->route('CategoryView');

    }



    //GetTariff By Category

    public function CategoryView(){
        $id = Auth::id();
        $category = Tariff::distinct()->where('user_id', $id)->pluck('category'); 

        return view("GenView.CategoryView", compact('category'));
    }

    public function showTariffNeg(){
        $id = Auth::id();
        $tariffs = Tariff::where('user_id', $id)->get(); 

        return view('Facility.TariffNeg', compact('tariffs'));
    }

 public function Sin(Request $request){

    $id=$request['id'];
    $tariff = Tariff::find($id);

        // Check if the row exists
        if ($tariff) {
         if ($request['type'] == 'drops') {
              $tariff['Edited_Service']=$request['des'];
              $tariff['code']=$request['code'];
              $tariff['Mapped']='Mapped';
              $tariff['score']=$request['score'];
         }else{
             $tariff['Edited_Tariff'] = $request['Tariff'];
            $tariff['Negotiated']='Negotiated';
         }
            $tariff->save();              // Save changes to DB
            return response()->json(['message'=>"successful",200]);
        }else{
            return response()->json(['message'=>"something went wrong",500]);
        }



 }


public function exportTariffsCsv($id){



            $tariffs = Tariff::where('user_id', $id)
                ->whereNotNull('code')
                ->where('code', '<>', '')
                ->get(['Edited_Service','SERVICE', 'Edited_Tariff', 'TARIFF', 'code']);

                    // Set CSV headers
                $headers = [
                    "Content-Type" => "text/csv charset=utf-8",
                    "Content-Disposition" => "attachment; filename=tariffs.csv",
                ];
            // Callback to write CSV content
                $callback = function() use ($tariffs) {
                    $file = fopen('php://output', 'w');

                    // Add CSV column headers
                    fputcsv($file, [ 'SERVICE', 'TARIFF','CODE']);

                    // Add data rows
                    foreach ($tariffs as $tariff) {
                        $tar;
                        if (strlen($tariff['Edited_Tariff'])===0) {$tar=$tariff['TARIFF'];}else{ $tar=$tariff['Edited_Tariff'];}   
                        fputcsv($file, [ $tariff->Edited_Service,$tariff->$tar,$tariff->code]);
                    }

                    fclose($file);
                };

            
            /*  $Pendtariff = PendingTariff::where('user_id', $id)->first();


            if ($Pendtariff) {
                $Pendtariff->delete(); // delete the record

                Tariff::where('user_id',$id)->delete();
            
            } 
            */
            return response()->stream($callback, 200, $headers);
                
} 


}
