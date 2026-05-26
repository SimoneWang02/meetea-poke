<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('snack_variants', function (Blueprint $table) {
            $table->boolean('mix_gusti')->default(false)->after('prezzo');
            $table->tinyInteger('num_pz')->unsigned()->nullable()->after('mix_gusti');
        });
    }

    public function down(): void
    {
        Schema::table('snack_variants', function (Blueprint $table) {
            $table->dropColumn(['mix_gusti', 'num_pz']);
        });
    }
};
