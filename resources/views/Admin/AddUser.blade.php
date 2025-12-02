
@extends('layouts.layout')
@section('content')


<div class="bg-orange-50 min-h-screen p-6">

  <div class="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8">
    <h1 class="text-3xl font-bold text-orange-600 mb-6">Add New Users</h1>

    <!-- Single User Form -->
    <form class="space-y-6 mb-8" action="" method="POST">
      @csrf
      <h2 class="text-xl font-semibold text-gray-700">Add Single User</h2>

      <input type="text" name="name" placeholder="Name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" required>
      <input type="email" name="email" placeholder="Email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" required>
      <input type="password" name="password" placeholder="Password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" required>

      <button type="submit" class="px-5 py-2.5 bg-orange-600 text-white rounded-xl shadow-md hover:bg-orange-700 hover:shadow-lg transition transform hover:scale-105">Save User</button>
    </form>

    <!-- Excel Upload Form -->
    <form class="space-y-6" action="{{ route('uploadFacilityExcel') }}" method="POST" enctype="multipart/form-data">
      @csrf
      <h2 class="text-xl font-semibold text-gray-700">Upload Users via Excel</h2>
 @if ($errors->any())
    <div class="text-red-500">
        {{ $errors->first('csverror') }}
    </div>
@endif

@if ($errors->has('file'))
    <div class="text-red-500">
        {{ $errors->first('file') }}
    </div>
@endif

@if (session('success'))
    <div class="text-green-500 bg-green-100 p-2 rounded mb-4">
        {{ session('success') }}
    </div>
@endif
      <input type="file" name="file" accept=".csv" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" required>
      <button type="submit" class="px-5 py-2.5 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 hover:shadow-lg transition transform hover:scale-105">Upload Excel</button>
    </form>

  </div>

</div>

@endsection