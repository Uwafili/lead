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
{{-- <div class="max-w-4xl mx-auto bg-white bg-opacity-95 rounded-xl shadow-2xl p-10 mt-10">
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
            <input type="text" placeholder="e.g. Urologist Consultation"
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
</div> --}}

<!-- Services Table -->
<div class="max-w-4xl mx-auto mt-8">
    <h3 class="text-2xl font-semibold text-orange-600 mb-3">Facility Dashboard</h3>
    <p class="text-gray-600 mb-4">View costs of services, negotiate pricing, or upload your own tariff proposal.</p>

    <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-orange-50">
                <tr>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Service</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Current Price</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Requested Price</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th class="px-6 py-3 text-center text-sm font-medium text-gray-700">Action</th>
                </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-100">
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Caesarean Section</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦650,000</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <input type="text" value="₦500,000" placeholder="₦0" class="w-40 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">Negotiated</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <div class="inline-flex gap-2">
                            <button class="px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600">Accept</button>
                            <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    {{-- <div class="mt-6 bg-white rounded-lg p-6 shadow">
        <h4 class="text-lg font-semibold mb-3">Upload Your Tariff Proposal</h4>
        <form action="#" method="post" enctype="multipart/form-data" class="flex items-center gap-3">
            <label class="flex-1">
                <input type="file" name="tariff_file" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700" />
            </label>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Upload</button>
        </form>
    </div> --}}
</div>
@endsection