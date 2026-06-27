<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Tariff;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

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

      return redirect()->route('currTarView');

}

public function login(Request $request){
  $field=$request->validate([
        'email'=>['required' ,'max:255','email'],
         'password'=>['required']

    ]);
    if(Auth::attempt($field,$request->remember)){
            return redirect()->route('currTarView');
    }
    else{
        return back()->withErrors([
            'failed'=>'Username/password is not valid'
        ]);
    }
}

public function showForgotPasswordForm(){
    return view('Auth.forgot-password');
}

public function resetPassword(Request $request){
    $field = $request->validate([
        'email' => ['required','email','exists:users,email'],
        'password' => ['required','confirmed', Password::min(8)->mixedCase()],
    ]);

    $user = User::where('email', $field['email'])->first();
    $user->password = Hash::make($field['password']);
    $user->save();

    return redirect()->route('login')->with('status', 'Password reset successfully. Please sign in.');
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
    $tariffs = Tariff::orderByRaw("Mapped = 'mapped'")->paginate(200); // number per page
    return view('Admin.tariff', compact('tariffs'));
}
 
public function show(){
        $users = User::all();
        return view('admin.users',compact('users'));
    }

    public function deleteUser(User $user){
        $user->delete();
        return redirect()->route('admin.users')->with('status', 'User deleted successfully.');
    }
}
