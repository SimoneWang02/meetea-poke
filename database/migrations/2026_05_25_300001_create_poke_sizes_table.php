<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('poke_sizes', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('nome');
            $table->decimal('prezzo', 5, 2);
            $table->unsignedSmallInteger('max_proteine');
            $table->unsignedSmallInteger('max_green');
            $table->unsignedSmallInteger('max_crispy');
            $table->unsignedSmallInteger('max_salse');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('poke_sizes');
    }
};
