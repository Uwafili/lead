@extends('layouts.layout')
@section('content')

<div class="bg-gray-100 min-h-screen">

    <!-- Header -->
    <div class="bg-white shadow p-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">
            Uploaded Excel Files
        </h1>

        <!-- Upload Button -->
        <a href="{{route('Ad_AddTariff')}}"  class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow transition">+ Upload Excel</a>
    </div>

    <!-- Content -->
    <div class="p-8">

        @if(count($names) > 0)
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                @foreach($names as $file)

                    <div class="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-100 group">

                        <!-- Icon -->
                        <div class="mb-4">
                            <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 group-hover:bg-green-200 transition">
                                📄
                            </div>
                        </div>

                        <!-- File Name -->
                        <h2 class="text-lg font-semibold text-gray-800 truncate">
                            {{ $file['name'] }}
                        </h2>

                        <!-- Action -->
                        <div class="mt-4">
                            <a href="{{ url('/excel/'.$file['name']) }}"
                               class="text-sm text-green-600 hover:underline">
                                View File →
                            </a>
                        </div>

                    </div>

                @endforeach

            </div>
        @else
            <div class="text-center text-gray-500 mt-20">
                No Excel files uploaded yet.
            </div>
        @endif

    </div>

</div>


@endsection