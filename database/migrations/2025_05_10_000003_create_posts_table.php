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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('domain'); // Domaine d'activité/spécialité
            $table->date('date_debut')->nullable(); // Date de début de disponibilité/stage
            $table->date('date_fin')->nullable(); // Date de fin de disponibilité/stage
            $table->string('ville')->nullable();
            $table->boolean('teletravail')->default(false);
            $table->string('type_stage')->nullable(); // Temps plein, temps partiel, etc.
            $table->boolean('remunere')->default(false);
            $table->decimal('montant_remuneration', 10, 2)->nullable();
            $table->json('competences')->nullable(); // Compétences requises/offertes en JSON
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};