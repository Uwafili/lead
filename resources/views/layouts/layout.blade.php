<!-- filepath: c:\Users\Bishop\leadway\resources\views\layouts\layout.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Leadway Style</title>
  <script src="https://cdn.tailwindcss.com"></script>
  {{-- <link rel="icon" type="{{('asset/smartphone-cup-near-laptop.jpg')}}"> --}}
 <!-- filepath: c:\Users\Bishop\leadway\resources\views\layouts\layout.blade.php -->
<link rel="icon" type="jpg" href="{{ asset('smartphone-cup-near-laptop.jpg') }}">
  <link rel="stylesheet" href="{{ asset('css/app.css') }}">
  <link rel="stylesheet" href="{{ asset('css/style.css') }}">
  <style>
    body {
      background-image: url({{('asset/smartphone-cup-near-laptop.jpg')}});
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

  <!-- 🌟 Navbar -->
  <!-- filepath: c:\Users\Bishop\leadway\resources\views\layouts\layout.blade.php -->
<header class="bg-orange-400 bg-opacity-95 text-black shadow-md">
  <div class="container mx-auto px-4 py-4 flex justify-between items-center">
    <h1 class="text-2xl font-extrabold tracking-wide">Leadway</h1>
    <nav class="space-x-6 flex items-center">
      <!-- Home -->
      @auth()
        
      <a href="{{ route('home') }}" class="inline-flex items-center hover:underline font-medium transition-colors duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
        </svg>
        Home
      </a>     <!-- Register -->
      @endauth

     
     @if (Auth::check() && Auth::user()->usertype === 'admin')
      <!-- Admin Dashboard -->    
      <a href="{{ route('admin.dashboard') }}" class="inline-flex items-center hover:underline font-medium transition-colors duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Admin Dashboard
      </a>
      @endif

      @guest
        
      <a href="{{ route('register') }}" class="inline-flex items-center hover:underline font-medium transition-colors duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
        Register
      </a>
      <!-- Login -->
      <a href="{{ route('login') }}" class="inline-flex items-center hover:underline font-medium transition-colors duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H3m0 0l4-4m-4 4l4 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Login
      </a>
      @endguest
      @auth
        
      <!-- Logout -->
       <form id="logout" action="{{route('logout')}}" method="POST">
        @csrf
        
      <a href="{{route('logout')}}" class="inline-flex items-center hover:underline font-medium transition-colors duration-200"
      onclick="event.preventDefault(); document.getElementById('logout').submit();">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
        </svg>
        Logout
      </a>
     
      </form>
      <!-- Settings -->
      <a href="#" class="inline-flex items-center hover:underline font-medium transition-colors duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Settings
      </a>
      @endauth
    </nav>
  </div>
</header>
  <!-- 🔽 Page Content with overlay for readability -->
  <main class="flex-1">
    <div class="bg-overlay py-10">
      <div class="container mx-auto px-4">
        @yield('content')
      </div>
    </div>
  </main>

  <!-- 🦶 Footer -->
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