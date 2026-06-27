@extends('layouts.layout')
@section('content')
<div class="fixed bottom-6 right-6 z-50">
  <a href="{{ route('chat.index', request()->query()) }}" class="inline-flex items-center space-x-2 rounded-full bg-red-600 px-4 py-3 text-white shadow-xl hover:bg-red-700 transition">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h8m-8 4h6" />
    </svg>
    <span>Chat</span>
  </a>
</div>

<div class="min-h-screen py-10">
  <div class="max-w-6xl mx-auto px-4">
    <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-0">
        <aside class="border-r border-gray-200 p-5 bg-red-50">
          <h2 class="text-xl font-bold text-red-700 mb-4">Chat</h2>
          <p class="text-sm text-gray-600 mb-4">This chat is between admin and the selected user.</p>
          @if($currentUser->usertype === 'admin')
            <div class="space-y-3">
              @forelse($chatUsers as $user)
                <a href="{{ route('chat.index', ['user' => $user->id]) }}" class="block rounded-2xl px-4 py-3 transition border {{ optional($selectedUser)->id === $user->id ? 'border-red-600 bg-red-100' : 'border-transparent hover:border-red-200 hover:bg-red-50' }}">
                  <p class="font-semibold text-red-700">{{ $user->name }}</p>
                  <p class="text-xs text-gray-500">{{ $user->email }}</p>
                </a>
              @empty
                <div class="rounded-2xl p-4 bg-white border border-gray-200 text-sm text-gray-500">
                  No users available to chat with.
                </div>
              @endforelse
            </div>
          @else
            <div class="rounded-3xl bg-white p-5 border border-red-100 shadow-sm">
              <p class="text-sm text-gray-700">You are chatting with admin.</p>
              @if($selectedUser)
              <p class="mt-2 font-semibold text-red-700">{{ $selectedUser->name }}</p>
              <p class="text-xs text-gray-500">{{ $selectedUser->email }}</p>
              @else
              <p class="mt-2 text-sm text-gray-500">No admin account registered yet.</p>
              @endif
            </div>
          @endif
        </aside>

        <section class="lg:col-span-2 p-6 flex flex-col h-full">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ $currentUser->usertype === 'admin' ? ($selectedUser ? $selectedUser->name : 'Select a user') : 'Admin Chat' }}</h1>
              <p class="text-sm text-gray-500">{{ $currentUser->usertype === 'admin' ? 'Send messages to the selected user.' : 'Send a message to admin.' }}</p>
            </div>
            @if($selectedUser)
              <div id="typingIndicator" class="hidden text-sm font-semibold text-red-700">User is typing...</div>
            @endif
          </div>

          <div class="flex-1 overflow-auto px-2 py-4 rounded-3xl bg-gray-50" style="max-height: 60vh;">
            @if($messages->isEmpty())
              <div class="text-center text-gray-500 mt-12">No conversation yet. Start by sending the first message.</div>
            @endif
            <div class="space-y-4">
              @foreach($messages as $message)
                @php $isMine = $message->sender_id === $currentUser->id; @endphp
                <div class="max-w-xl {{ $isMine ? 'ml-auto bg-red-600 text-white' : 'mr-auto bg-white text-gray-900' }} rounded-2xl px-5 py-3 shadow-sm">
                  <div class="flex items-center justify-between text-xs uppercase tracking-wide font-semibold {{ $isMine ? 'text-red-100' : 'text-red-600' }}">
                    <span>{{ $isMine ? 'You' : 'Them' }}</span>
                    @if($isMine)
                      <span class="text-xs {{ $message->read_at ? 'text-red-100' : 'text-red-200' }}">{{ $message->read_at ? 'Seen' : 'Delivered' }}</span>
                    @endif
                  </div>
                  <p class="mt-2">{{ $message->body }}</p>
                  <div class="mt-2 text-xs {{ $isMine ? 'text-red-100' : 'text-gray-500' }}">
                    {{ $message->created_at->format('M d, H:i') }}
                  </div>
                </div>
              @endforeach
            </div>
          </div>

          <div class="mt-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <form action="{{ route('chat.send') }}" method="POST" class="space-y-4">
              @csrf
              @if($currentUser->usertype === 'admin' && $selectedUser)
                <input type="hidden" name="receiver_id" value="{{ $selectedUser->id }}" />
              @endif
              @if($currentUser->usertype !== 'admin' && $selectedUser)
                <input type="hidden" name="receiver_id" value="{{ $selectedUser->id }}" />
              @endif

              <div>
                <label for="body" class="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="body" name="body" rows="3" required
                  class="mt-2 w-full rounded-2xl border-gray-200 shadow-sm focus:border-red-500 focus:ring-red-500"></textarea>
                @error('body')
                  <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                @enderror
              </div>
              <button type="submit" class="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700 transition">Send Message</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  </div>
</div>

@push('script')
<script>
  const bodyField = document.getElementById('body');
  const typingIndicator = document.getElementById('typingIndicator');
  let typingTimeout;

  if (bodyField && typingIndicator) {
    bodyField.addEventListener('input', () => {
      typingIndicator.classList.remove('hidden');
      typingIndicator.textContent = '{{ $currentUser->usertype === "admin" ? "Admin is typing..." : "User is typing..." }}';
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        typingIndicator.classList.add('hidden');
      }, 1200);
    });

    bodyField.addEventListener('blur', () => {
      typingTimeout = setTimeout(() => {
        typingIndicator.classList.add('hidden');
      }, 500);
    });
  }
</script>
@endpush
@endsection
