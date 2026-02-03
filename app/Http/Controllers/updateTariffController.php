<?php

namespace App\Http\Controllers;

use App\Models\PendingTariff;
use App\Models\Tariff;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;


class updateTariffController extends Controller
{
   public function index(Request $request){
     $request->validate([
        'file' => 'required|mimes:csv|file|max:5120', 
    ]);

    
    
    if($request['facility']){
     
         $user = User::where('name', $request->facility)->first();
   if ($user) {
     $id = $user->id;
    $name=$user->name;
 PendingTariff::create([
        'user_id'=>$id,
        'user_name'=>$name,
    ]);
   }else{
    return back()->withErrors(['message' => 'Facility Name Not Found']);

   }

    }else{
         PendingTariff::create([
        'user_id'=>Auth::id(),
        'user_name'=>Auth::user()->name,
    ]);
    }

    if (($handle = fopen($request->file('file')->getPathname(), "r")) !== FALSE) {
            if($request['facility']){
       $id = User::where('name', $request['facility'])->firstOrFail()->id;
            }else{
                $id=Auth::id();
            }
    $header = fgetcsv($handle); // Skip header
    while (($row = fgetcsv($handle)) !== FALSE) {
        Tariff::create([
             
            'user_id'=>$id,
            'SERVICE'  => $row[0],
            'TARIFF' => $row[1],
            
        ]);
    }
    fclose($handle);


   
}

 if (Auth::check()&& Auth::user()->usertype=='admin') {
    return redirect()->route("admin.dashboard");
 }{
    return redirect()->route('consultation');
 }
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
            $tariff['Edited']=$request['des'];
            $tariff['TARIFF'] = $request['Tariff'];
            $tariff->save();              // Save changes to DB
            return response()->json(['message'=>"successful",200]);
        }else{
            return response()->json(['message'=>"something went wrong",500]);
        }



 }



 public function exportTariffsCsv($id){
  $tariffs = Tariff::where('user_id', $id)
        ->get(['SERVICE', 'TARIFF']); 


        // Set CSV headers
    $headers = [
        "Content-Type" => "text/csv charset=utf-8",
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

   
    $Pendtariff = PendingTariff::where('user_id', $id)->first();


if ($Pendtariff) {
    $Pendtariff->delete(); // delete the record

    Tariff::where('user_id',$id)->delete();
   return response()->stream($callback, 200, $headers);
} 

    
}


}
