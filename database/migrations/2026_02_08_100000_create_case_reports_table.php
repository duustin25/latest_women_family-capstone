<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('case_reports', function (Blueprint $table) {
            $table->id();
            $table->string('case_number')->unique();
            $table->enum('type', ['VAWC', 'BCPC']); // Denotes the kind of case

            // Victim Information
            $table->string('victim_name')->nullable();
            $table->string('victim_age')->nullable();
            $table->string('victim_gender')->nullable();

            // Complainant/Informant Information
            $table->string('complainant_name')->nullable();
            $table->string('complainant_contact')->nullable();
            $table->string('relation_to_victim')->nullable(); // For VAWC if different
            $table->boolean('is_anonymous')->default(false);

            // Incident Details
            $table->dateTime('incident_date')->nullable();
            $table->string('incident_location');
            $table->text('description');

            // Lifecycle State Machine
            $table->enum('lifecycle_status', ['New', 'Ongoing', 'Referred', 'Resolved', 'Closed', 'Dismissed'])
                ->default('New');

            // Categorization and Status (Foreign Keys to Configuration Tables)
            $table->foreignId('abuse_type_id')->nullable()->constrained('case_abuse_types')->nullOnDelete();
            $table->foreignId('case_status_id')->nullable()->constrained('case_statuses')->nullOnDelete();

            // Evidence
            $table->string('evidence_path')->nullable(); // For uploaded files

            // Referral Columns
            $table->foreignId('referral_agency_id')->nullable()->constrained('case_referral_agencies')->nullOnDelete();
            $table->dateTime('referral_date')->nullable();
            $table->text('referral_notes')->nullable();

            // Accountability
            $table->foreignId('handled_by_id')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_reports');
    }
};
