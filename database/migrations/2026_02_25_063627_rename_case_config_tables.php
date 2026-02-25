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
        if (Schema::hasTable('abuse_types') && !Schema::hasTable('case_abuse_types')) {
            Schema::rename('abuse_types', 'case_abuse_types');
        }

        if (Schema::hasTable('referral_partners') && !Schema::hasTable('case_referral_agencies')) {
            Schema::rename('referral_partners', 'case_referral_agencies');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('case_abuse_types') && !Schema::hasTable('abuse_types')) {
            Schema::rename('case_abuse_types', 'abuse_types');
        }

        if (Schema::hasTable('case_referral_agencies') && !Schema::hasTable('referral_partners')) {
            Schema::rename('case_referral_agencies', 'referral_partners');
        }
    }
};
