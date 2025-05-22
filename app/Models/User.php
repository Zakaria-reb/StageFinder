<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
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
        'cv_path',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Vérifie si l'utilisateur est de type étudiant
     *
     * @return bool
     */
    public function isEtudiant()
    {
        return $this->type === 'etudiant';
    }

    /**
     * Vérifie si l'utilisateur est de type entreprise
     *
     * @return bool
     */
    public function isEntreprise()
    {
        return $this->type === 'entreprise';
    }

    /**
     * Get the posts for the user.
     */
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    
}