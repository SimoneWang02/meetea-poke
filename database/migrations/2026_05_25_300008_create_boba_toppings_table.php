<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('boba_toppings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('boba_topping_groups')->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('boba_toppings')->cascadeOnDelete();
            $table->string('nome');
            $table->decimal('prezzo', 5, 2)->default(0);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('boba_toppings');
    }
};
