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
        Schema::table('vawc_reports', function (Blueprint $table) {
            $table->string('abuse_type')->nullable()->after('incident_date'); // e.g. Physical, Sexual, etc.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vawc_reports', function (Blueprint $table) {
            $table->dropColumn('abuse_type');
        });
    }
};
