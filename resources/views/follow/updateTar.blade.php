@extends('layouts.layout')
@section('content')



  <div class="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-orange-200">
    <h2 class="text-3xl font-bold text-center text-orange-700 mb-6">Upload Your File</h2>

    @if ($errors->any())
    <div class="text-red-500">
        {{ $errors->first('message') }}
    </div>
@endif


    <form class="space-y-6" action="{{route('UpdateTar')}}" method="POST" enctype="multipart/form-data">
    @csrf

        <div class="border-2 border-dashed border-orange-400 rounded-xl p-8 text-center hover:bg-orange-50 transition cursor-pointer">
        <input type="file" id="file" name="file" class="hidden TarInput" />
        <label for="file" class="cursor-pointer text-orange-600 font-medium">
          <div class="flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 118 0m1 4H6a2 2 0 01-2-2v-3a2 2 0 012-2h12a2 2 0 012 2v3a2 2 0 01-2 2z" />
            </svg>
            <span class="text-lg">Click to upload or drag file here</span>
            
          </div>
        </label>
        
      </div>
<p class="TarName"></p>

  @auth
    @if(Auth::user() && Auth::user()->usertype == 'admin')
    <input 
    name="facility"
  type="text" 
  class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none" 
  placeholder="Name Of Facility"
>

    @endif
  @endauth

 @error('file')
        <p class="text-red-600 mt-2">{{ $message }}</p>
    @enderror

      <button class="w-full py-3 rounded-xl bg-orange-600 text-white font-semibold shadow-md hover:bg-orange-700 hover:shadow-lg transition">
        Upload File
      </button>
    </form>
  </div>


  <script>
    document.querySelector(".TarInput").addEventListener("change",(e)=>{
       document.querySelector(".TarName").innerHTML=e.target.files[0].name
    })
  </script>


</html>

@endsection