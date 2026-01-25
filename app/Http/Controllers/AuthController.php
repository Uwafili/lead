<?php

namespace App\Http\Controllers;

use App\Models\Tariff;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;

use App\Models\User;

use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
  public function register(Request $request){
      $field=$request->validate([
            'name'=>['required', 'max:255'],
            'email'=>['required', 'max:255', 'email' ,'unique:users,email'],
            'password'=>['required', 'confirmed',  Password::min(8)->mixedCase(),] // Ensure password confirmation is handled
      ]);
      
      
      $field['usertype']=($request->email==='leadway@gmail.com')?'admin':'user';
      $user=user::create($field);

      Auth::login($user);

      return redirect()->route('home');

}

public function login(Request $request){
  $field=$request->validate([
        'email'=>['required' ,'max:255','email'],
         'password'=>['required']

    ]);
    if(Auth::attempt($field,$request->remeber)){
      return redirect()->intended();
    }
    else{
        return back()->withErrors([
            'failed'=>'Username/password is not valid'
        ]);
    }
}

public function adminDashboard(){
    if(Auth::check()&& Auth::user()->usertype=='admin'){
      $users=user::with('pendingtariffs')->get();
      
      return view('admin.dashboard', compact('users'));
    }
    else if(Auth::check()&& Auth::user()->usertype==='user'){
       return redirect()->route('dashboard');
    }
    else{
         return redirect()->route('login')->with('error', 'You must be logged in to access this page.');
         
      }
}

  public function logout(Request $request){
    Auth::logout();

    $request->session()->invalidate();

    $request->session()->regenerateToken();

    return redirect()->route('register');
  }

public function adminTar($id){
$tariffs=Tariff::where('user_id',$id)->get();

return view('Admin.tariff', compact('tariffs'));
}  
 

}
