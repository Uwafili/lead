<!-- filepath: c:\Users\Bishop\leadway\resources\views\Auth\register.blade.php -->
@extends('layouts.layout')
@section('content')
<div class="flex items-center justify-center min-h-screen tariff-background">
  <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">Welcome To PMU Kitchen</h2>
    <p class="text-center text-gray-500 mb-6">Create your account below</p>

    <form action="{{ route('register') }}" method="POST" class="space-y-4">
      @csrf
      <!-- Name -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">User Name</label>
        <input type="text" name="name" id="name" value="{{ old('name') }}"
          class="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        @error('name')
          <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
        @enderror
      </div>
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
        <input type="text" name="email" id="email" value="{{ old('email') }}"
          class="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        @error('email')
          <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
        @enderror
      </div>
      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="relative">
          <input type="password" name="password" id="password" 
            class="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <span class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" onclick="togglePasswordVisibility('password')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12s2-4 9-4 9 4 9 4-2 4-9 4-9-4-9-4z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
        </div>
        @error('password')
          <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
        @enderror
      </div>
      <!-- Confirm Password -->
      <div>
        <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm Password</label>
        <div class="relative">
          <input type="password" name="password_confirmation" id="password_confirmation" 
            class="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <span class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" onclick="togglePasswordVisibility('password_confirmation')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12s2-4 9-4 9 4 9 4-2 4-9 4-9-4-9-4z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
        </div>
      </div>
      <!-- Register Button -->
      <button type="submit"
  class="w-full px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition duration-200 font-semibold">
  Sign In
</button>
    </form>

    <!-- Login Link -->
    <p class="text-sm text-center text-gray-600 mt-4">
      Already have an account?
      <a href="{{ route('login') }}" class="text-blue-600 hover:underline font-semibold">Login</a>
    </p>
  </div>
</div>
<script>
  function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    field.type = field.type === 'password' ? 'text' : 'password';
  }
</script>
@endsection