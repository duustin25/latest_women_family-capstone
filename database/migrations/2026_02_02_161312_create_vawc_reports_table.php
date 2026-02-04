<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vawc_reports', function (Blueprint $table) {
            $table->id();
            $table->string('case_number')->unique();
            $table->string('victim_name');
            $table->string('victim_age')->nullable();
            $table->string('complainant_name')->nullable();
            $table->string('complainant_contact')->nullable();
            $table->string('relation_to_victim')->nullable(); // If complainant is different
            $table->dateTime('incident_date');
            $table->string('incident_location');
            $table->text('description');
            $table->boolean('is_anonymous')->default(false);
            $table->string('evidence_path')->nullable(); // For uploaded files
            $table->string('status')->default('pending'); // pending, reviewed, closed, referred

            // Referral Columns
            $table->string('referral_to')->nullable(); // e.g. "PNP", "DSWD", "PAO"
            $table->dateTime('referral_date')->nullable();
            $table->text('referral_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vawc_reports');
    }
};
