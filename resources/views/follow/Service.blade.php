@extends('layouts.layout')
@section('content')
<!-- Hero Header -->
<div class="relative flex items-center justify-center h-[40vh] md:h-[50vh] bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 shadow-lg overflow-hidden mb-10">
    <img src="{{ asset('asset/consultation.jpg') }}" alt="Pharmacy" class="absolute inset-0 w-full h-full object-cover opacity-40" />
    <div class="absolute inset-0 bg-gradient-to-t from-orange-700/60 via-orange-400/30 to-transparent"></div>
    <div class="relative z-10 text-center px-4">
        <h1 class="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-4">Consultation Services</h1>
        <p class="text-lg md:text-xl text-white font-medium drop-shadow leading-relaxed">
            Welcome to the Consultation Services section.
           This page allows your facility to add or update consultation services provided at your cente
            <br>
            Please fill in details such as consultation type, description, attending professional, and fees.
            <br>
            Keeping this information accurate helps Leadway PMU better understand your services and improve patient access and coordination
        </p>
    </div>
</div>

<!-- Form Section -->
<div class="max-w-4xl mx-auto bg-white bg-opacity-95 rounded-xl shadow-2xl p-10 mt-10">
    <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold text-orange-600 mb-2">Consultation Entry Form</h2>
        <p class="text-gray-600">
            Kindly fill in the medication details below. Our team is committed to affordability and quality care.
        </p>
    </div>

    <form class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Description -->
        <div>
            <label class="block font-semibold text-orange-600 mb-1">Description</label>
            <input type="text" placeholder="e.g. Electrocardiogram"
                   class="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none bg-orange-50" />
        </div>

        <!-- Quantity -->
       
        <!-- Payment -->
        <div>
            <label class="block font-semibold text-orange-700 mb-1">Payment (₦)</label>
            <input type="number" placeholder="e.g. 3000"
                   class="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none bg-orange-50" />
        </div>

        <!-- Pack / Tab -->
        

        <!-- Submit -->
        <div class="md:col-span-2 text-center mt-4">
            <button type="submit"
                    class="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg shadow hover:from-orange-600 hover:to-yellow-600 transition">
                Submit
            </button>
        </div>
    </form>
</div>
@endsection