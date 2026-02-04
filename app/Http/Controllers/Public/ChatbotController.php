<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatbotController extends Controller
{
    public function index()
    {
        return Inertia::render('Public/Chatbot', [
            // specific props if any
        ]);
    }

    public function query(Request $request, \App\Services\ChatbotService $bot)
    {
        $request->validate(['message' => 'required|string']);

        $response = $bot->processQuery($request->input('message'));

        return response()->json([
            'response' => $response,
        ]);
    }

    public function chat(Request $request, \App\Services\ChatbotService $bot)
    {
        // Same logic for now
        return $this->query($request, $bot);
    }
}