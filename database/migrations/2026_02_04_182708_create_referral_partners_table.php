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
        Schema::create('referral_partners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->default('Both'); // VAWC, BCPC, Both
            $table->string('contact_info')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed Default Partners
        DB::table('referral_partners')->insert([
            ['name' => 'Philippine National Police (PNP)', 'category' => 'Both', 'contact_info' => '117', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'DSWD', 'category' => 'Both', 'contact_info' => '(02) 931-8101', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Public Attorney\'s Office (PAO)', 'category' => 'VAWC', 'contact_info' => '(02) 929-9436', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Barangay Health Center', 'category' => 'Both', 'contact_info' => 'Local Health Office', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('referral_partners');
    }
};
