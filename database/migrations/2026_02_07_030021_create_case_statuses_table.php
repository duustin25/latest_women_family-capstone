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
        Schema::create('case_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Under Mediation", "BPO Monitoring"
            $table->string('type')->default('Both'); // VAWC, BCPC, Both
            $table->string('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_statuses');
    }
};
