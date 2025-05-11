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
        Schema::table('users', function (Blueprint $table) {
            // Ajouter le champ type pour distinguer les étudiants des entreprises
            $table->enum('type', ['etudiant', 'entreprise'])->default('etudiant')->after('email');
            
            // Informations pour tous les utilisateurs
            $table->string('telephone')->nullable()->after('type');
            $table->string('ville')->nullable()->after('telephone');
            $table->text('bio')->nullable()->after('ville');
            $table->string('avatar')->nullable()->after('bio');
            
            // Informations spécifiques aux étudiants
            $table->string('ecole')->nullable()->after('avatar');
            $table->string('niveau_etudes')->nullable()->after('ecole');
            $table->string('specialite')->nullable()->after('niveau_etudes');
            
            // Informations spécifiques aux entreprises
            $table->string('secteur_activite')->nullable()->after('specialite');
            $table->string('site_web')->nullable()->after('secteur_activite');
            $table->string('adresse')->nullable()->after('site_web');
            
            // Champ pour stocker le chemin du CV
            $table->string('cv_path')->nullable()->after('adresse');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'type',
                'telephone',
                'ville',
                'bio',
                'avatar',
                'ecole',
                'niveau_etudes',
                'specialite',
                'secteur_activite',
                'site_web',
                'adresse',
                'cv_path'
            ]);
        });
    }
};