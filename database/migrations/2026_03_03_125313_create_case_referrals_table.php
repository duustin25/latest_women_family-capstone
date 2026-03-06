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
        Schema::create('case_referrals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_report_id')->constrained('case_reports')->cascadeOnDelete();
            $table->foreignId('agency_id')->constrained('agencies')->cascadeOnDelete();
            $table->dateTime('referred_at');
            $table->text('referral_notes')->nullable();
            $table->enum('status', ['Pending', 'Accepted', 'Declined', 'Completed'])->default('Pending');
            $table->text('agency_feedback')->nullable();
            $table->foreignId('handled_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_referrals');
    }
};
