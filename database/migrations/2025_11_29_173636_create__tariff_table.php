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
        Schema::create('tariffs', function (Blueprint $table) {
            $table->id();
            $table->integer("user_id");
             $table->string('SERVICE');
             $table->string('TARIFF');
             $table->string("Edited_Tariff");
             $table->string("Edited_Service");
             $table->string('Negotiated');
             $table->string('Mapped');
             $table->string('score');
             $table->string('code');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariff');
    }
};
