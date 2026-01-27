<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FacilityController extends Controller
{
    public function uploadFacilityExcel(Request $request)
    {
        
        $request->validate([
            'file' => 'required|mimes:csv|file|max:5120', 
        ]);

        $file = $request->file('file');

        if (($handle = fopen($file->getPathname(), 'r')) !== false) {

            $header = fgetcsv($handle); // Skip header

            DB::beginTransaction();

            try {
                while (($row = fgetcsv($handle)) !== false) {
                    if (empty($row[0]) || empty($row[1]) || empty($row[2])) {
                        continue; // skip empty rows
                    }

                    // Check if email already exists
                    if (!User::where('email', $row[1])->exists()) {
                        User::create([
                            'name'     => $row[0],
                            'email'    => $row[1],
                            'password' => Hash::make($row[2]),
                        ]);
                    }
                }

                DB::commit();
                fclose($handle);

                return back()->with('success', 'USERS imported successfully!');
            } catch (\Exception $e) {
                DB::rollBack();
                fclose($handle);
                return back()->with('csverror', 'Error importing CSV: ' . $e->getMessage());
            }
        }

        return back()->with('csverror', 'Unable to open CSV file.');
    }
    
}
