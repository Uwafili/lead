@extends('layouts.layout')
@section('content')

<div class="bg-red-50 min-h-screen p-6">

 <div class="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8">
<div class="flex items-center justify-between mb-6">
<h1 class="text-3xl font-bold text-red-600">All Users</h1>
 <a href="{{ route('addFacility') }}" class="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 hover:shadow-lg transition transform hover:scale-105"> 
Add New Facility
</a>
</div>


<div class="overflow-x-auto">
<table class="min-w-full divide-y divide-gray-200">
<thead class="bg-red-100">
<tr>
<th class="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Name</th>
<th class="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Email</th>
<th class="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Password</th>
<th class="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Action</th>
</tr>
</thead>


<tbody class="bg-white divide-y divide-gray-200">
@forelse ($users as $user)
<tr class="hover:bg-red-50 transition">
    <td class="px-6 py-4 whitespace-nowrap">{{ $user->name }}</td>
    <td class="px-6 py-4 whitespace-nowrap">{{ $user->email }}</td>
    <td class="px-6 py-4 whitespace-nowrap">{{ $user->password }}</td>
    <td class="px-6 py-4 whitespace-nowrap">
      <form method="POST" action="{{ route('admin.users.delete', $user) }}" onsubmit="return confirm('Delete this user?');">
        @csrf
        @method('DELETE')
        <button type="submit" class="px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition">Delete</button>
      </form>
    </td>
</tr>
@empty
<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No users found</td></tr>
@endforelse
</tbody>
</table>
</div>
</div>
</div>

    @endsection