<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration
{
    public function up(): void
    {
        // converte "ORD-001" → 1 per i dati esistenti
        DB::statement("UPDATE orders SET numero_ordine = CAST(SUBSTRING(numero_ordine, 5) AS UNSIGNED) WHERE numero_ordine LIKE 'ORD-%'");

        DB::statement("ALTER TABLE orders MODIFY COLUMN numero_ordine SMALLINT UNSIGNED NOT NULL DEFAULT 0");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE orders MODIFY COLUMN numero_ordine VARCHAR(255) NOT NULL DEFAULT ''");
        DB::statement("UPDATE orders SET numero_ordine = CONCAT('ORD-', LPAD(numero_ordine, 3, '0'))");
    }
};
