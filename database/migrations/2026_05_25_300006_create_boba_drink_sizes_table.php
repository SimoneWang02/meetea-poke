<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('boba_drink_sizes')) {
            return;
        }

        Schema::create('boba_drink_sizes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('drink_id')->constrained('boba_drinks')->cascadeOnDelete();
            $table->enum('size', ['M', 'G']);
            $table->decimal('prezzo', 5, 2);
            $table->timestamps();

            $table->unique(['drink_id', 'size']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('boba_drink_sizes');
    }
};
