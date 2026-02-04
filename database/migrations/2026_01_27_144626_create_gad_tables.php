<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Table 1: The Programs/Events
        Schema::create('gad_programs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('category'); 
            $table->string('location');
            $table->dateTime('event_date');
            $table->integer('slots')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Table 2: The Applicants/Beneficiaries
        Schema::create('gad_applications', function (Blueprint $table) {
            $table->id();
            // foreignId MUST come after the table it references is created
            $table->foreignId('gad_program_id')->constrained()->onDelete('cascade');
            $table->string('full_name');
            $table->string('sex'); 
            $table->date('birthdate');
            $table->string('address');
            $table->string('contact_number');
            $table->string('civil_status');
            $table->string('employment_status');
            $table->string('status')->default('Pending'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the child table first to avoid foreign key constraint errors
        Schema::dropIfExists('gad_applications');
        Schema::dropIfExists('gad_programs');
    }
};