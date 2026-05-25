<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('poke_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('poke_ingredient_groups')->cascadeOnDelete();
            $table->string('slug');
            $table->string('nome');
            $table->boolean('vegano')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->unique(['group_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('poke_ingredients');
    }
};
