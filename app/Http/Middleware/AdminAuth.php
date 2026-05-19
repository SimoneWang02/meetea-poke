<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = (string) ($request->bearerToken() ?? '');
        $expected = (string) config('services.admin.token');

        if ($expected === '' || ! hash_equals($expected, $token)) {
            return response()->json(['message' => 'Non autorizzato'], 401);
        }

        return $next($request);
    }
}
