<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('numero_ordine')->unique();
            $table->string('nome_cliente');
            $table->string('telefono');
            $table->string('orario_ritiro');
            $table->text('note')->nullable();
            $table->enum('stato', ['nuovo', 'in_preparazione', 'pronto'])->default('nuovo');
            $table->timestamps();

            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
