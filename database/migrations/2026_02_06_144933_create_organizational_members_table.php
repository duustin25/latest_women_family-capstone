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
        Schema::create('organizational_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->nullable() // Nullable because not all staff might need a login
                ->constrained('users')
                ->onDelete('set null');
            $table->string('position');
            $table->string('committee')->nullable();
            $table->string('image_path')->nullable();
            $table->enum('level', ['head', 'secretary', 'staff']);
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizational_members');
    }
};
