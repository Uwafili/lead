@extends('layouts.layout')
@section('content')
<div id="container" class="flex justify-center items-center mt-8">
    <form action="" method="POST" enctype="multipart/form-data" class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        @csrf
        <label class="block mb-2 text-sm font-medium text-gray-700" for="file">Choose file</label>
        <input type="file" name="file" id="file" class="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4" required>
        <button type="submit" class="w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition">Upload</button>
    </form>
</div>
@endsection