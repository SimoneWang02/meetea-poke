<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BotPrerender
{
    private const BOTS = [
        'googlebot', 'bingbot', 'yahoo! slurp', 'duckduckbot',
        'baiduspider', 'yandexbot', 'sogoubot', 'exabot',
        'facebookexternalhit', 'facebot', 'ia_archiver',
        'twitterbot', 'linkedinbot', 'whatsapp', 'slackbot',
        'telegrambot', 'applebot', 'semrushbot', 'ahrefsbot',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        if ($this->isBot($request->userAgent())) {
            $html = $this->loadPrerender(trim($request->path(), '/'));
            if ($html !== null) {
                return response($html, 200, ['Content-Type' => 'text/html; charset=utf-8']);
            }
        }

        return $next($request);
    }

    private function isBot(?string $ua): bool
    {
        if (!$ua) {
            return false;
        }
        $ua = strtolower($ua);
        foreach (self::BOTS as $bot) {
            if (str_contains($ua, $bot)) {
                return true;
            }
        }
        return false;
    }

    private function loadPrerender(string $path): ?string
    {
        $file = match ($path) {
            '', '/' => 'home.html',
            'ordina'  => 'ordina.html',
            'privacy' => 'privacy.html',
            default   => 'home.html',
        };

        $fullPath = public_path("prerender/{$file}");
        return file_exists($fullPath) ? file_get_contents($fullPath) : null;
    }
}
