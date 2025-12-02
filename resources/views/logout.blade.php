 @auth

        <form action="{{ route('logout') }}" method="POST" class="inline">
          @csrf
          <button type="submit" class="ment inline-flex items-center hover:underline font-medium transition-colors duration-200">
            <!-- Logout Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H3m0 0l4-4m-4 4l4 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Logout
          </button>
        </form>
        @endauth


        <script>
          window.onload=()=>{
            document.querySelector(".ment").click()
          }
        </script>