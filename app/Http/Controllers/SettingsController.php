<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SettingsController extends Controller
{
    public function updatePrintStatus(Request $request): JsonResponse
    {
        $request->validate(['enabled' => 'required|boolean']);

        DB::table('app_settings')
            ->updateOrInsert(
                ['key' => 'print_service_enabled'],
                ['value' => $request->boolean('enabled') ? 'true' : 'false', 'updated_at' => now()]
            );

        return response()->json(['ok' => true]);
    }

    public function orderingStatus(): JsonResponse
    {
        $row = DB::table('app_settings')->where('key', 'print_service_enabled')->first();
        $enabled = $row ? $row->value === 'true' : true;

        return response()->json(['ordering_available' => $enabled]);
    }
}
