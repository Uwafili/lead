@extends('layouts.layout')
@section('content')
<div class="mt-6">
    <h2 class="text-xl font-semibold mb-4">Users Table</h2>
    <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded shadow">
            <thead>
                <tr class="bg-gray-100 text-left">
                    <th class="py-2 px-4 border-b">Name</th>
                    <th class="py-2 px-4 border-b">Email</th>
                    <th class="py-2 px-4 border-b">Role</th>
                    <th class="py-2 px-4 border-b">Joined</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($users as $user)
                    <tr class="hover:bg-gray-50">
                
                        <td class="py-2 px-4 border-b">{{ $user->name }}</td>
                        <td class="py-2 px-4 border-b">{{ $user->email }}</td>
                        <td class="py-2 px-4 border-b capitalize">{{ $user->role }}</td>
                        <td class="py-2 px-4 border-b">{{ $user->created_at->format('d M Y') }}</td>
                    <form action=" {{ route('admin.dashboard.destroy') }}">" method="post">
                        @csrf
                        @method('DELETE')
                        <td class="py-2 px-4 border-b">
                            <button type="submit" class="text-red-600 hover:text-red-800 transition-colors duration-200">
                                Delete
                            </button>
                        </td>
                    </form>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

@endsection