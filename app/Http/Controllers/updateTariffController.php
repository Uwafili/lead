<?php

namespace App\Http\Controllers;

use App\Models\PendingTariff;
use App\Models\Tariff;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;


class updateTariffController extends Controller
{
   public function index(Request $request){
     $request->validate([
        'file' => 'required|mimes:csv|file|max:5120', 
    ]);


    if (($handle = fopen($request->file('file')->getPathname(), "r")) !== FALSE) {
    $header = fgetcsv($handle); // Skip header
    while (($row = fgetcsv($handle)) !== FALSE) {
        Tariff::create([
            'user_id'=>Auth::id(),
            'SERVICE'  => $row[0],
            'TARIFF' => $row[1],
            
        ]);
    }
    fclose($handle);

    PendingTariff::create([
        'user_id'=>Auth::id(),
        'user_name'=>Auth::user()->name,
    ]);

}

 return back()->with('success', 'Excel data imported successfully!');
    }


    public function show(){
        $id = Auth::id();
$tariffs = Tariff::where('user_id', $id)->get(); 

return view('follow.consultation', compact('tariffs'));
    }

 public function Sin(Request $request){

    $id=$request['id'];
    $tariff = Tariff::find($id);

// Check if the row exists
if ($tariff) {
    $tariff['TARIFF'] = $request['Tariff'];
    $tariff->save();              // Save changes to DB
}

 }



 public function exportTariffsCsv($id){
  $tariffs = Tariff::where('user_id', $id)
        ->get(['SERVICE', 'TARIFF']); 


        // Set CSV headers
    $headers = [
        "Content-Type" => "text/csv",
        "Content-Disposition" => "attachment; filename=tariffs.csv",
    ];
// Callback to write CSV content
    $callback = function() use ($tariffs) {
        $file = fopen('php://output', 'w');

        // Add CSV column headers
        fputcsv($file, [ 'SERVICE', 'TARIFF']);

        // Add data rows
        foreach ($tariffs as $tariff) {
            fputcsv($file, [ $tariff->SERVICE, $tariff->TARIFF]);
        }

        fclose($file);
    };

   
    $tariff = PendingTariff::where('user_id', $id)->first();

if ($tariff) {
    $tariff->delete(); // delete the record
   return response()->stream($callback, 200, $headers);
} 

    
}


}
