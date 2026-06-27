<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function index(Request $request)
    {
        $currentUser = Auth::user();
        $chatUsers = collect();
        $selectedUser = null;
        $messages = collect();

        if ($currentUser->usertype === 'admin') {
            $chatUsers = User::where('usertype', 'user')->get();
            $selectedUser = $request->query('user')
                ? $chatUsers->where('id', $request->query('user'))->first()
                : $chatUsers->first();

            if ($selectedUser) {
                $messages = ChatMessage::where(function ($query) use ($currentUser, $selectedUser) {
                    $query->where('sender_id', $currentUser->id)
                          ->where('receiver_id', $selectedUser->id);
                })->orWhere(function ($query) use ($currentUser, $selectedUser) {
                    $query->where('sender_id', $selectedUser->id)
                          ->where('receiver_id', $currentUser->id);
                })->orderBy('created_at')->get();

                ChatMessage::where('receiver_id', $currentUser->id)
                    ->where('sender_id', $selectedUser->id)
                    ->whereNull('read_at')
                    ->update(['read_at' => now()]);
            }
        } else {
            $adminUser = User::where('usertype', 'admin')->first();
            if ($adminUser) {
                $selectedUser = $adminUser;
                $messages = ChatMessage::where(function ($query) use ($currentUser, $adminUser) {
                    $query->where('sender_id', $currentUser->id)
                          ->where('receiver_id', $adminUser->id);
                })->orWhere(function ($query) use ($currentUser, $adminUser) {
                    $query->where('sender_id', $adminUser->id)
                          ->where('receiver_id', $currentUser->id);
                })->orderBy('created_at')->get();

                ChatMessage::where('receiver_id', $currentUser->id)
                    ->where('sender_id', $adminUser->id)
                    ->whereNull('read_at')
                    ->update(['read_at' => now()]);
            }
        }

        return view('chat.index', compact('currentUser', 'chatUsers', 'selectedUser', 'messages'));
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'body' => ['required', 'string', 'max:1000'],
            'receiver_id' => ['nullable', 'exists:users,id'],
        ]);

        $sender = Auth::user();
        $receiverId = $request->input('receiver_id');

        if ($sender->usertype === 'admin') {
            $receiver = User::where('id', $receiverId)->where('usertype', 'user')->first();
            if (! $receiver) {
                return back()->withErrors(['receiver_id' => 'Select a valid user to chat with.']);
            }
        } else {
            $receiver = User::where('usertype', 'admin')->first();
            if (! $receiver) {
                return back()->withErrors(['body' => 'Admin account is not available.']);
            }
        }

        ChatMessage::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'body' => $request->body,
        ]);

        return redirect()->route('chat.index', $sender->usertype === 'admin' ? ['user' => $receiver->id] : []);
    }

    public function markRead(Request $request)
    {
        $currentUser = Auth::user();
        ChatMessage::where('receiver_id', $currentUser->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['status' => 'ok']);
    }
}
