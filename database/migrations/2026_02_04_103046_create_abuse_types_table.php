<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('abuse_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Physical, Sexual, etc.
            $table->string('color')->nullable(); // Hex code for chart (optional)
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed default types
        DB::table('abuse_types')->insert([
            ['name' => 'Physical', 'color' => '#ef4444', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Sexual', 'color' => '#a855f7', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Psychological', 'color' => '#f97316', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Economic', 'color' => '#3b82f6', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('abuse_types');
    }
};
