<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE order_items MODIFY COLUMN tipo ENUM('poke','bubbletea','sfizio','bevande') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE order_items MODIFY COLUMN tipo ENUM('poke','bubbletea','sfizio') NOT NULL");
    }
};
