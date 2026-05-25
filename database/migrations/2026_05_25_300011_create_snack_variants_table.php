<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('snack_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('snack_id')->constrained('snacks')->cascadeOnDelete();
            $table->string('qty');
            $table->decimal('prezzo', 5, 2);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['snack_id', 'qty']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('snack_variants');
    }
};
