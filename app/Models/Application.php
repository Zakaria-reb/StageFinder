<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;
    
    /**
     * Les attributs qui sont assignables en masse.
     *
     * @var array
     */
    protected $fillable = [
        'post_id',
        'user_id',
        'status', // 'pending', 'accepted', 'rejected'
        'message'
    ];
    
    /**
     * Obtenir l'utilisateur qui a postulé.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Obtenir l'offre de stage concernée.
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}