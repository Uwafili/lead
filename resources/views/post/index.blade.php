    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Leadway Tariff Machine</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <!-- Tailwind classes assumed available via project build (Vite/Tailwind) -->
    </head>
    <body class="bg-gray-50">
        <div class="min-h-screen flex items-center justify-center px-4">
            <div class="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center text-black">
                <h1 class="text-4xl md:text-6xl font-extrabold text-black leading-tight">
                    Welcome to Leadway <span class="text-red-600">Health</span> Tariff Machine
                </h1>
                <p class="mt-6 text-lg md:text-xl text-black">
                    Explore and manage tariff data quickly — upload, review, negotiate, and export tariffs with ease.
                </p>

                <div class="mt-8 flex items-center justify-center gap-4">
                    <a href="{{ route('login') }}" class="inline-block px-6 py-3 bg-red-600 text-white rounded-lg text-sm md:text-base font-semibold shadow hover:bg-red-700 transition">Sign In</a>
                    <a href="{{ route('register') }}" class="inline-block px-6 py-3 border border-red-600 text-red-600 rounded-lg text-sm md:text-base font-semibold hover:bg-red-50 transition">Register</a>
                </div>

                <p class="mt-6 text-sm text-black">Need help? Contact your admin or check the documentation.</p>
            </div>
        </div>
    </body>
    </html>