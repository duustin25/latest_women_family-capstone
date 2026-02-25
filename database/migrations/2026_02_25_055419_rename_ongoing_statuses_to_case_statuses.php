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
        if (Schema::hasTable('ongoing_statuses') && !Schema::hasTable('case_statuses')) {
            Schema::rename('ongoing_statuses', 'case_statuses');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('case_statuses') && !Schema::hasTable('ongoing_statuses')) {
            Schema::rename('case_statuses', 'ongoing_statuses');
        }
    }
};
