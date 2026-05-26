<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('boba_drinks', function (Blueprint $table) {
            $table->dropColumn('top_seller');
        });
    }

    public function down(): void
    {
        Schema::table('boba_drinks', function (Blueprint $table) {
            $table->boolean('top_seller')->default(false)->after('image_path');
        });
    }
};
