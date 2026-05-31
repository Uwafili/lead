<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class FacilityController extends Controller
{
    //Add Facilities
 public function uploadFacilityExcel(Request $request)
{
    $request->validate([
        'file' => 'required|file|mimes:xlsx,xls,csv|max:5120',
    ]);

    try {

        $file = $request->file('file');

        $spreadsheet = IOFactory::load($file->getPathname());

        $sheet = $spreadsheet->getActiveSheet();

        $rows = $sheet->toArray();

        DB::beginTransaction();

        foreach ($rows as $index => $row) {

            // Skip header row
            if ($index == 0) {
                continue;
            }

            // Skip empty rows
            if (empty($row[0]) || empty($row[1]) || empty($row[2])) {
                continue;
            }

            $name = trim($row[0]);
            $email = trim($row[1]);
            $password = trim($row[2]);

            // Check if user already exists
            if (!User::where('email', $email)->exists()) {

                User::create([
                    'name'     => $name,
                    'email'    => $email,
                    'password' => Hash::make($password),
                ]);
            }
        }

        DB::commit();

        return back()->with('success', 'Users imported successfully!');

    } catch (\Exception $e) {

        DB::rollBack();

        return back()->with(
            'FileError',
            'Error importing file: ' . $e->getMessage()
        );
    }
}

    public function getUsers(Request $request){
        $users = User::where('id','!=',auth()->id())->get();
        return view('Admin.users',compact('users'));
    }
}
