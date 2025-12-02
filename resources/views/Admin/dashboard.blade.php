@extends('layouts.layout')
@section('content')
<div class="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-8">
 <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold text-orange-600">Facilities with Pending Tariff</h1>

    <a href="{{ route('updateTar') }}"
        class="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-semibold shadow-md hover:bg-orange-700 hover:shadow-lg transition transform hover:scale-105">
        Update Facility Tariff
    </a>
</div>

    <div class="overflow-x-auto">

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-orange-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Facility Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
       @foreach ($users as $user)
         @if(count($user['pendingtariffs']) !==0)
            <tr class="hover:bg-orange-50 transition">
            <td class="px-6 py-4 whitespace-nowrap">{{$user['pendingtariffs'][0]['user_name'] }}</td>         
            <td class="px-6 py-4 whitespace-nowrap">{{$user['pendingtariffs'][0]['updated_at'] }}</td>
        <td class="px-6 py-4 whitespace-nowrap text-orange-600 font-semibold"><a href="{{ route('admin.tariff', ['id' => $user['pendingtariffs'][0]['user_id'] ]) }}">View</a></td>
</tr>
          @endif
       @endforeach
          <!-- Add more rows as needed -->
        </tbody>
      </table>
    </div>
  </div>



</html>
@endsection