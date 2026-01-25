@extends('layouts.layout')
@section('content')

<style>
  .dropdown-item {
    @apply px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer;
  }
</style>

<div class="overflow-x-auto bg-white rounded-lg shadow">

    <div id="successAlert" class="hidden fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
        Updated successfully!
    </div>

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
            @foreach ($tariffs as $tariff)
            <tr data-service="{{ $tariff['SERVICE'] }}">
                <td>
                    <div class="relative w-full max-w-sm">
                        <button class="dropdownButton w-full flex justify-between items-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-200">
                            <span class="selectedValue emp px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $tariff['SERVICE'] }}</span>
                            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <ul class="dropdownMenu absolute z-10 mt-2 hidden w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden"></ul>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $tariff['TARIFF'] }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <input type="text" value="{{ $tariff['TARIFF'] }}" class="newTar w-40 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="₦0" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">Negotiated</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <div class="inline-flex gap-2">
                        <button class="send px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 flex items-center gap-2" data-id="{{ $tariff['id'] }}">
                            <svg class="hidden spinner animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            <span class="label">Send</span>
                        </button>
                        <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
                    </div>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>

<a href="{{ route('tariffs.export', ['id' => 2]) }}" class="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl shadow-md hover:bg-orange-700 hover:shadow-lg transition transform hover:scale-105">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    Save
</a>

<script type="module">
import Tar from "{{ asset('js/Tar.js') }}";
const drugs = Tar.map(s => s.tariff_desc);
const tariffs = @json($tariffs);

// Initialize Worker
const worker = new Worker(new URL("{{ asset('workers/tariffWorker.js') }}", import.meta.url), { type: "module" });


// Listen to worker results and populate dropdowns

tariffs.forEach(ele => {
    
});

// Send all tariffs to worker
tariffs.forEach(tariff => {
    worker.postMessage({ word: tariff['SERVICE'], dictionary: drugs });
});

// Dropdown open/close logic
document.querySelectorAll(".dropdownButton").forEach(button => {
    const menu = button.nextElementSibling;
    button.addEventListener("click", e => {
        e.stopPropagation();
        menu.classList.toggle("hidden");
    });
});

document.addEventListener("click", () => {
    document.querySelectorAll(".dropdownMenu").forEach(menu => menu.classList.add("hidden"));
});

// CSRF & Send button logic
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

document.querySelectorAll(".send").forEach(button => {
    button.addEventListener("click", async () => {
        const spinner = button.querySelector(".spinner");
        const label = button.querySelector(".label");
        const rowId = button.dataset.id;
        const newTar = button.closest("tr").querySelector(".newTar").value;

        spinner.classList.remove("hidden");
        label.textContent = "Loading...";
        button.disabled = true;

        try {
            const res = await fetch('/UpdateSinTar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify({ id: rowId, Tariff: newTar })
            });
            const data = await res.json();
            showAlert();
            console.log(data);
        } catch (err) {
            showAlert();
        } finally {
            spinner.classList.add("hidden");
            label.textContent = "Send";
            button.disabled = false;
        }
    });
});

// Success alert
function showAlert() {
    const alert = document.getElementById("successAlert");
    alert.classList.remove("hidden");
    setTimeout(() => alert.classList.add("hidden"), 2000);
}
</script>

@endsection
