@extends('layouts.layout')
@section('content')
<div class="flex items-center justify-center min-h-screen bg-gray-50 px-4">
  <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
    <h2 class="text-3xl font-bold text-center text-black">Reset Your Password</h2>
    <p class="text-center text-gray-600">Enter your account email and choose a new password.</p>

    @if(session('status'))
      <div class="p-4 text-sm text-green-700 bg-green-100 rounded-lg">
        {{ session('status') }}
      </div>
    @endif

    <form action="{{ route('password.update') }}" method="POST" class="space-y-4">
      @csrf
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
        <input type="email" name="email" id="email" value="{{ old('email') }}" required
          class="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
        @error('email')
          <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
        @enderror
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">New password</label>
        <div class="relative">
          <input type="password" name="password" id="password" required
            class="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          <button type="button" onclick="togglePasswordVisibility('password')" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
        @error('password')
          <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
        @enderror
      </div>

      <div>
        <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm password</label>
        <div class="relative">
          <input type="password" name="password_confirmation" id="password_confirmation" required
            class="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          <button type="button" onclick="togglePasswordVisibility('password_confirmation')" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>

      <button type="submit"
        class="w-full px-4 py-3 text-white bg-red-600 rounded-lg text-sm font-semibold hover:bg-red-700 transition duration-200">
        Reset Password
      </button>
    </form>

    <p class="text-sm text-center text-gray-600">
      Remembered your password?
      <a href="{{ route('login') }}" class="text-red-600 hover:underline font-semibold">Sign in</a>
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
