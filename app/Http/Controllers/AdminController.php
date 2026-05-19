<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'password' => ['required', 'string'],
        ]);

        $expected = (string) config('services.admin.password');
        $token = (string) config('services.admin.token');

        if ($expected === '' || $token === '' || ! hash_equals($expected, $data['password'])) {
            return response()->json(['message' => 'Password errata'], 401);
        }

        return response()->json(['token' => $token]);
    }
}
