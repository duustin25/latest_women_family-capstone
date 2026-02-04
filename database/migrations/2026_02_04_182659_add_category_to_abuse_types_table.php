<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('abuse_types', function (Blueprint $table) {
            $table->string('category')->default('VAWC')->after('name'); // VAWC, BCPC, Both
        });

        // Update default BCPC types if they exist or insert them
        // Assuming user wants BCPC types: Abandonment, CICL, etc.
        // Let's seed/update some common ones here for immediate utility
        $bcpcTypes = ['Abandonment', 'CICL', 'Child Labor', 'Bullying'];
        foreach ($bcpcTypes as $type) {
            DB::table('abuse_types')->updateOrInsert(
                ['name' => $type],
                ['category' => 'BCPC', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()]
            );
        }

        // Ensure others are VAWC (default handled by schema but good to be explicit for existing)
    }

    public function down(): void
    {
        Schema::table('abuse_types', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }
};
