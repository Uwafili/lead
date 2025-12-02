@extends('layouts.layout')
@section('content')

<div class="bg-orange-50 min-h-screen p-6">

 <div class="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8">
<div class="flex items-center justify-between mb-6">
<h1 class="text-3xl font-bold text-orange-600">All Facilities</h1>
<a href="{{ route('addFacility') }}" class="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-semibold shadow-md hover:bg-orange-700 hover:shadow-lg transition transform hover:scale-105">
Add New Facility
</a>
</div>


<div class="overflow-x-auto">
<table class="min-w-full divide-y divide-gray-200">
<thead class="bg-orange-100">
<tr>
<th class="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Facility Name</th>
<th class="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Email</th>
<th class="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Password</th>
</tr>
</thead>


<tbody class="bg-white divide-y divide-gray-200">
<!-- Example Row (You will populate dynamically with Laravel) -->


    {{-- <tr class="hover:bg-orange-50 transition">
    <td class="px-6 py-4 whitespace-nowrap">{{$user['name']}}</td>
    <td class="px-6 py-4 whitespace-nowrap">{{$user['email']}}</td>
    <td class="px-6 py-4 whitespace-nowrap">{{ $user['password'] }}</td>
</tr> --}}

<tr class="hover:bg-orange-50 transition">
<td class="px-6 py-4 whitespace-nowrap">Chivar Specialist Hospital</td>
<td class="px-6 py-4 whitespace-nowrap">chivar@example.com</td>
<td class="px-6 py-4 whitespace-nowrap">••••••••</td>

</tr>


<tr class="hover:bg-orange-50 transition">
<td class="px-6 py-4 whitespace-nowrap">prime Specialist Hospital</td>
<td class="px-6 py-4 whitespace-nowrap">prime@example.com</td>
<td class="px-6 py-4 whitespace-nowrap">••••••••</td>

</tr>
<!-- Repeat as needed -->
</tbody>
</table>
</div>
</div>
</div>

    @endsection