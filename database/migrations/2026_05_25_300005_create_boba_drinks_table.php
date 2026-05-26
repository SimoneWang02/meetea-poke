<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('boba_drinks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('boba_categories')->cascadeOnDelete();
            $table->string('slug');
            $table->string('nome');
            $table->text('ingredienti')->nullable();
            $table->string('image_path')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->unique(['category_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('boba_drinks');
    }
};
