@extends('layouts.layout')
@section('content')
<div class="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
  <h2 class="text-2xl font-bold mb-6 text-center text-gray-700">Pharmacy Input Form</h2>
  <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <!-- Description -->
    <div>
      <label class="block text-gray-600 font-semibold mb-2" for="description">Description</label>
      <input type="text" id="description" name="description" placeholder="Enter medicine name or use"
             class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
    </div>

    <!-- Quantity -->
    <div>
      <label class="block text-gray-600 font-semibold mb-2" for="quantity">Quantity</label>
      <input type="number" id="quantity" name="quantity" placeholder="e.g. 10"
             class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
    </div>

    <!-- Payment -->
    <div>
      <label class="block text-gray-600 font-semibold mb-2" for="payment">Payment (₦)</label>
      <input type="number" id="payment" name="payment" placeholder="e.g. 2500"
             class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
    </div>

    <!-- Pack or Tab -->
    <div>
      <label class="block text-gray-600 font-semibold mb-2" for="type">Pack / Tab</label>
      <select id="type" name="type"
              class="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="">Select one</option>
        <option value="pack">Pack</option>
        <option value="tab">Tab</option>
      </select>
    </div>

    <!-- Submit Button (Full Width on Bottom) -->
    <div class="md:col-span-2 text-center mt-4">
      <button type="submit"
              class="px-8 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Submit</button>
    </div>

  </form>
</div>

@endsection