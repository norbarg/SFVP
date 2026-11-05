<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('routes', function (Blueprint $table) {
            $table->id();

            $table->string('name', 150);

            $table->unsignedInteger('duration');

            $table->string('difficulty', 20);

            $table->foreignId('country_id')
                ->constrained('countries')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('routes');
    }
};