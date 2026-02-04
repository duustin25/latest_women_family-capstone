<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bcpc_reports', function (Blueprint $table) {
            $table->id();
            $table->string('case_number')->unique();
            $table->string('concern_type'); // abuse, neglect, labor, etc.
            $table->string('location');
            $table->text('description');
            $table->string('informant_name')->nullable();
            $table->string('informant_contact')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bcpc_reports');
    }
};
