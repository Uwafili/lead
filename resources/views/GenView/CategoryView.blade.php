@extends('layouts.layout')

@section('content')

<body class="bg-gray-100 min-h-screen">

    <!-- Header -->
    <div class="bg-white shadow p-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">
            Excel Sheets
        </h1>

        <span class="text-sm text-gray-500">
            {{ count($category) }} Sheets Found
        </span>
    </div>

    <!-- Content -->
    <div class="p-8">

        @if(count($category) > 0)
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                @foreach($category as $sheet)

                    <a href=""
                       class="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 group border border-gray-100">

                        <!-- Icon -->
                        <div class="mb-4">
                            <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 group-hover:bg-green-200 transition">
                                📊
                            </div>
                        </div>

                        <!-- Title -->
                        <h2 class="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition">
                            {{ $sheet }}
                        </h2>

                        <!-- Subtitle -->
                        <p class="text-sm text-gray-500 mt-2">
                            Click to view sheet data
                        </p>

                    </a>

                @endforeach

            </div>
        @else
            <div class="text-center text-gray-500 mt-20">
                No sheets found in this file.
            </div>
        @endif

    </div>

</body>

@endsection