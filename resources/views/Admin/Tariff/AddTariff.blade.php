@extends('layouts.layout')

@section('content')

<div class="bg-linear-to-br from-gray-100 to-gray-200 min-h-screen flex items-center justify-center">

    <div class="w-full max-w-2xl px-6">

        <!-- Card -->
        <div class="bg-white rounded-3xl shadow-xl p-10">

            <!-- Header -->
            <div class="text-center mb-8"><h1 class="text-3xl font-bold text-gray-800">Upload Tariff</h1></div>

          @if(session('error'))
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ session('error') }}
    </div>
@endif

@if(session('success'))
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {{ session('success') }}
    </div>
@endif

@if ($errors->any())
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <ul>
            @foreach ($errors->all() as $error)
                <li>- {{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif
            <!-- Form -->
            <form action="{{ route('Post_Ad_AddTariff') }}" method="POST" enctype="multipart/form-data">
                @csrf
    <div class="mb-6">
        <label class="block mb-2 text-sm font-medium text-gray-700">
            Select Action
        </label>

        <select name="type"
                class="w-full rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500 shadow-sm">
            <option value="">Choose Tariff Type</option>
            <option value="Hospital">Hospital</option>
            <option value="Dental">Dental</option>
            <option value="Optical">Optical</option>

        </select>
    </div>
                <!-- File Input -->
                <div class="mb-6">
                    <label class="block mb-2 text-sm font-medium text-gray-700">
                        Select Excel File
                    </label>

                    <div class="flex items-center justify-center w-full">
                        <label class="flex flex-col w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-green-400 transition">

                            <div class="flex flex-col items-center justify-center pt-7">
                                <span class="text-4xl">📁</span>
                                <p class="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                                <p class="text-xs text-gray-400"> XLSX, XLS, CSV (Max: 2MB)</p>
                            </div>

                            <input type="file" name="file" class="hidden" required>
                        </label>
                    </div>
                </div>

                <!-- Submit -->
                <button type="submit"
                        class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition duration-300">
                    Upload File
                </button>

            </form>

        </div>

        <!-- Footer -->
        <p class="text-center text-gray-400 text-sm mt-6">
            Built with Laravel + Tailwind
        </p>

    </div>

</div>

@endsection