<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('poke_ingredients', function (Blueprint $table) {
            $table->dropColumn('vegano');
        });
    }

    public function down(): void
    {
        Schema::table('poke_ingredients', function (Blueprint $table) {
            $table->boolean('vegano')->default(false)->after('nome');
        });
    }
};
