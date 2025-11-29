@extends('layouts.layout')
@section('content')
<div class="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-8">
    <h1 class="text-3xl font-bold text-orange-600 mb-6">Facilities with Pending Tariff</h1>

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