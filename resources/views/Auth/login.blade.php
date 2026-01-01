@extends('layouts.layout')
@section('content')
<div class="flex items-center justify-center min-h-screen">
  <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
    <p class="text-center text-gray-500 mb-6">Sign in to your account</p>

    <form action="{{ route('login') }}" method="POST" class="space-y-4">
      @csrf
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
        <input type="email" name="email" id="email" required
          class="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        @error('email')
          <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
        @enderror
      </div>
      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="relative">
          <input type="password" name="password" id="password" required
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
      <!-- Remember me and Forgot -->
      <div class="flex items-center justify-between">
        <label class="flex items-center">
          <input type="checkbox" name="remember" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <span class="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <a href="#" class="text-sm text-blue-600 hover:underline">Forgot password?</a>
      </div>
      @error('failed')
        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
      @enderror
      <!-- Login Button -->
      <button type="submit"
  class="w-full px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition duration-200 font-semibold">
  Sign In
</button>
    </form>

    <!-- Signup Link -->
    <p class="text-sm text-center text-gray-600 mt-4">
      Don't have an account?
      <a href="{{ route('register') }}" class="text-blue-600 hover:underline font-semibold">Sign up</a>
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