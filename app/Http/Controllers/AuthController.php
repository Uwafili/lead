<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;

use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
  public function register(Request $request){
      $field=$request->validate([
            'name'=>['required', 'max:255'],
            'email'=>['required', 'max:255', 'email'],
            'password'=>['required', 'min:4']
      ]);
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
  public function logout(Request $request){
    Auth::logout();

    $request->session()->invalidate();

    $request->session()->regenerateToken();

    return redirect()->route('register');
  }

  

}
