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
        Schema::table('bcpc_reports', function (Blueprint $table) {
            $table->string('victim_name')->nullable()->after('case_number');
            $table->string('victim_age')->nullable()->after('victim_name');
            $table->string('victim_gender')->nullable()->after('victim_age');

            // Referral Columns
            $table->string('referral_to')->nullable();
            $table->dateTime('referral_date')->nullable();
            $table->text('referral_notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bcpc_reports', function (Blueprint $table) {
            $table->dropColumn(['victim_name', 'victim_age', 'victim_gender', 'referral_to', 'referral_date', 'referral_notes']);
        });
    }
};
