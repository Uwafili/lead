<!-- filepath: c:\Users\Bishop\lead\resources\views\layouts\layout.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <title>Leadway Health</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="{{ asset('css/app.css') }}">
  <link rel="stylesheet" href="{{ asset('css/style.css') }}">
  <style>
    body {
      background-image: url('{{ asset('smartphone-cup-near-laptop.jpg') }}');
      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
    }
    .bg-overlay {
      background: rgba(255, 255, 255, 0.386);
      min-height: 100vh;
    }
  </style>
</head>
<body class="flex flex-col min-h-screen">

  <!-- Top Navbar -->
  <header class="bg-orange-400 bg-opacity-95 text-black shadow-md">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-extrabold tracking-wide">Love</h1>
      <nav class="space-x-6 flex items-center">
        <a href="{{ route('home') }}" class="inline-flex items-center hover:underline font-medium transition-colors duration-200">
          <!-- Home Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
          </svg>
          Home
        </a>
        @guest
          
        <a href="{{ route('register') }}" class="inline-flex items-center hover:underline font-medium transition-colors duration-200">
          <!-- Register Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
          Register
        </a>
        <a href="{{ route('login') }}" class="inline-flex items-center hover:underline font-medium transition-colors duration-200">
          <!-- Login Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H3m0 0l4-4m-4 4l4 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Login
        </a>
        @endguest
        @auth
        <a href="#" class="inline-flex items-center hover:underline font-medium transition-colors duration-200">
          <!-- Settings Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Settings
        </a>
        @endauth


       @auth
    @if(Auth::user() && Auth::user()->usertype == 'admin')
        <a href="{{route('admin.dashboard') }}" class="inline-flex items-center hover:underline font-medium transition-colors duration-200">
          <!-- Admin Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Admin   
        </a>
        @else   <p class="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"><a href="{{route('updateTar')}}">Update Tariff</a></p>

    @endif
@endauth

       <a href="{{ route('logoutDemo') }}">Logout</a>


      </nav>

    </div>
  </header>
  @auth
  <div class="flex flex-1">
    <!-- Left Side Navbar with Health Icons -->
    <!-- filepath: c:\Users\Bishop\lead\resources\views\layouts\layout.blade.php -->
    <aside class="w-28 bg-white bg-opacity-80 shadow-lg flex flex-col items-center py-8 space-y-8">
      <!-- Pharmacy Icon -->
      <a href="{{route('home')}}" class="flex flex-col items-center group">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600 group-hover:text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="6" y="6" width="12" height="12" rx="3" stroke-width="2" stroke="currentColor" fill="none"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6" />
    </svg>
    <span class="text-xs mt-1 text-gray-700">Leadway</span>
  </a>
  <!-- Consultation Icon (User/Doctor) -->
  <a href="{{route('consultation')}}" class="flex flex-col items-center group">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 group-hover:text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="8" r="4" stroke-width="2" stroke="currentColor" fill="none"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 20v-2a6 6 0 0112 0v2" />
    </svg>
    <span class="text-xs mt-1 text-gray-700">Consultation</span>
  </a>
  <!-- Service Icon (Clipboard) -->
  <a href="{{route('Service')}}" class="flex flex-col items-center group">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-500 group-hover:text-orange-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="6" y="4" width="12" height="16" rx="2" stroke-width="2" stroke="currentColor" fill="none"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8h6M9 12h6M9 16h6" />
    </svg>
    <span class="text-xs mt-1 text-gray-700">Service</span>
  </a>
  <!-- Radiology Icon (X-ray/Camera) -->
  <a href="#" class="flex flex-col items-center group">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-500 group-hover:text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="3" y="7" width="18" height="10" rx="2" stroke-width="2" stroke="currentColor" fill="none"/>
      <circle cx="12" cy="12" r="3" stroke-width="2" stroke="currentColor" fill="none"/>
    </svg>
    <span class="text-xs mt-1 text-gray-700">TARIFF</span>
  </a>
  <!-- Accommodation Icon (Home) -->
    @auth
    @if(Auth::user() && Auth::user()->usertype == 'admin')
  <a href="{{route('admin.users')}}" class="flex flex-col items-center group">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-600 group-hover:text-yellow-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
    </svg>
    <span class="text-xs mt-1 text-gray-700">USERS</span>
  </a>
   @endif
@endauth
  <!-- Laboratory Icon (Beaker) -->
  <a href="#" class="flex flex-col items-center group">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500 group-hover:text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 19H5l7-7V5a2 2 0 10-4 0v7l7 7z" />
    </svg>
    <span class="text-xs mt-1 text-gray-700">Laboratory</span>
  </a>
</aside>
@endauth

    <!-- Main Content -->
    <main class="flex-1">
      <div class="bg-overlay py-10">
        <div class="container mx-auto px-4">
          @yield('content')
        </div>
      </div>
    </main>
  </div>

  <!-- Footer -->
  <footer class="bg-black bg-opacity-90 text-white">
    <div class="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
      <p class="text-sm">&copy; 2025 Leadway Assurance Company. All rights reserved.</p>
      <div class="mt-4 md:mt-0 space-x-4">
        <a href="https://www.leadway.com/privacy-policy/" class="hover:text-orange-400 text-sm transition">Privacy Policy</a>
        <a href="https://www.leadway.com/wp-content/uploads/2019/07/TERMSdoc.pdf" class="hover:text-orange-400 text-sm transition">Terms of Service</a>
        <a href="https://www.leadway.com/contact-us/" class="hover:text-orange-400 text-sm transition">Support</a>
      </div>
    </div>
  </footer>
</body>
</html>