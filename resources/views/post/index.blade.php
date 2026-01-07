@extends('layouts.layout')

@section('content')
<!-- Hero Header -->
<div class="relative flex items-center justify-center h-[40vh] md:h-[50vh] bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 shadow-lg overflow-hidden mb-10">
    <img src="{{ asset('asset/collection.jpg') }}" alt="Pharmacy" class="absolute inset-0 w-full h-full object-cover opacity-40" />
    <div class="absolute inset-0 bg-gradient-to-t from-orange-700/60 via-orange-400/30 to-transparent"></div>
    <div class="relative z-10 text-center px-4">
        <h1 class="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-4"> {{ \Carbon\Carbon::now()->format('Y') }} Leadway Tariff</h1>
        <p class="text-lg md:text-xl text-white font-medium drop-shadow leading-relaxed">
            This document represents Leadway Assurance’s full tariff and is provided solely for the purpose of engagement and 
            negotiation with healthcare service providers nationwide. The rates displayed reflect our best tariff across Nigeria,
             carefully structured to ensure fairness, consistency, and alignment with national healthcare service standards. </p>
    </div>
</div>

<!-- Form Section -->
<div class="max-w-4xl mx-auto bg-white bg-opacity-95 rounded-xl shadow-2xl p-10 mt-10">
    <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold text-orange-600 mb-2">Tariff Entry</h2>
        <p class="text-gray-600">
            Find our full tariff below. Rates reflect Leadway’s best pricing across services and locations, for your review and negotiation.
        </p>
    </div>
<table class="min-w-full border border-gray-300 border-collapse text-left rounded-lg shadow">
    <thead>
        <tr class="bg-orange-200">
            <th class="border px-4 py-2 text-orange-900">Service</th>
            <th class="border px-4 py-2 text-orange-900">Service Category</th>
            <th class="border px-4 py-2 text-orange-900">Tariff (₦)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="border px-4 py-2">ALKALINE PHOSPHATASE</td>
            <td class="border px-4 py-2">LABORATORY</td>
            <td class="border px-4 py-2">1,000.00</td>
        </tr>
        <tr>
            <td class="border px-4 py-2">ALPHA FETO PROTEIN</td>
            <td class="border px-4 py-2">LABORATORY</td>
            <td class="border px-4 py-2">7,680.00</td>
        </tr>
        <tr>
            <td class="border px-4 py-2">AMYLASE(PANCREATIC)</td>
            <td class="border px-4 py-2">LABORATORY</td>
            <td class="border px-4 py-2">2,500.00</td>
        </tr>
        <tr>
            <td class="border px-4 py-2">ANC SCREEN ONLY</td>
            <td class="border px-4 py-2">LABORATORY</td>
            <td class="border px-4 py-2">10,000.00</td>
        </tr>
        <tr>
            <td class="border px-4 py-2">ANTI NEUTROPHIL CYTOPLASMIC</td>
            <td class="border px-4 py-2">LABORATORY</td>
            <td class="border px-4 py-2">16,742.40</td>
        </tr>
        <tr>
            <td class="border px-4 py-2">ANTI NUCLEAR ANTIBODY</td>
            <td class="border px-4 py-2">LABORATORY</td>
            <td class="border px-4 py-2">9,523.20</td>
        </tr>
        <tr>
            <td class="border px-4 py-2">ANTI DNA</td>
            <td class="border px-4 py-2">LABORATORY</td>
            <td class="border px-4 py-2">8,140.80</td>
        </tr>
        
        <!-- Continue for the rest of the services -->
        <tr>
            <td class="border px-4 py-2">ANTI DNA</td>
            <td class="border px-4 py-2">LABORATORY</td>
            <td class="border px-4 py-2">8,140.80</td>
        </tr>
        <tr>
            <td class="border px-4 py-2">ANTI DNA</td>
            <td class="border px-4 py-2">LABORATORY</td>
            <td class="border px-4 py-2">8,140.80</td>
        </tr>
        <tr>
            <td class="border px-4 py-2">ANTI DNA</td>
            <td class="border px-4 py-2">LABORATORY</td>
            <td class="border px-4 py-2">8,140.80</td>
        </tr>
        <tr>
            <td class="border px-4 py-2">ANTI DNA</td>
            <td class="border px-4 py-2">LABORATORY</td>
            <td class="border px-4 py-2">8,140.80</td>
        </tr>
        <tr>
            <td class="border px-4 py-2">ANTI DNA</td>
            <td class="border px-4 py-2">LABORATORY</td>
            <td class="border px-4 py-2">8,140.80</td>
        </tr>

    </tbody>
</table>


     <div class="mt-6 text-right">
        <a href="{{ route('tariff.download') }}" 
           class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded shadow font-semibold transition duration-200">
            Download Full Tariff
        </a>
    </div>
</div>
@endsection