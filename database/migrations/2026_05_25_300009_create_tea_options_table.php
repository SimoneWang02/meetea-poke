<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tea_options', function (Blueprint $table) {
            $table->id();
            $table->enum('gruppo', ['basi', 'latte', 'pearls', 'dolcezza', 'ghiaccio']);
            $table->string('nome');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->index(['gruppo', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tea_options');
    }
};
