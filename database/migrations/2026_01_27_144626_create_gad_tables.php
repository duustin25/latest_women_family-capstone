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
        Schema::create('gad_activities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('activity_type', ['Client-Focused', 'Org-Focused', 'Attribution']);
            $table->enum('status', ['Planned', 'Ongoing', 'Completed'])->default('Planned');
            $table->dateTime('date_scheduled');
            $table->decimal('total_project_cost', 15, 2)->default(0);
            $table->decimal('hgdg_score', 5, 2)->nullable(); // For Attribution
            $table->decimal('gad_chargeable_amount', 15, 2)->default(0);
            $table->decimal('actual_expenditure', 15, 2)->nullable(); // Filled after event
            $table->json('target_participants')->nullable(); // e.g. ["KALIPI", "Admins"]
            $table->string('attendance_file')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gad_activities');
    }
};