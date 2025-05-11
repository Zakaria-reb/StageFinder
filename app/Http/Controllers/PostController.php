<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    /**
     * Afficher toutes les offres de stage
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // Récupérer les filtres
        $domain = $request->input('domain');
        $ville = $request->input('ville');
        $type_stage = $request->input('type_stage');
        $teletravail = $request->input('teletravail');
        $remunere = $request->input('remunere');
        $search = $request->input('search');
        
        // Construire la requête
        $query = Post::with('user')
            ->orderBy('created_at', 'desc');
        
        // Appliquer les filtres
        if ($domain) {
            $query->where('domain', $domain);
        }
        
        if ($ville) {
            $query->where('ville', $ville);
        }
        
        if ($type_stage) {
            $query->where('type_stage', $type_stage);
        }
        
        if ($teletravail !== null) {
            $query->where('teletravail', $teletravail == '1');
        }
        
        if ($remunere !== null) {
            $query->where('remunere', $remunere == '1');
        }
        
        // Recherche textuelle
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%')
                  ->orWhere('competences', 'like', '%' . $search . '%');
            });
        }
        
        // Pagination des résultats
        $posts = $query->paginate(10);
        
        return response()->json([
            'posts' => $posts,
            'filters' => [
                'domain' => Post::distinct()->pluck('domain'),
                'ville' => Post::distinct()->pluck('ville'),
                'type_stage' => Post::distinct()->pluck('type_stage'),
            ]
        ]);
    }

    /**
     * Enregistrer une nouvelle offre de stage
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'domain' => 'required|string|max:100',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'ville' => 'required|string|max:100',
            'teletravail' => 'boolean',
            'type_stage' => 'required|string|max:100',
            'remunere' => 'boolean',
            'montant_remuneration' => 'nullable|numeric|required_if:remunere,true',
            'competences' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $post = Post::create(array_merge(
            $request->all(),
            ['user_id' => Auth::id()]
        ));

        return response()->json([
            'message' => 'Offre de stage créée avec succès',
            'post' => $post
        ], 201);
    }

    /**
     * Afficher une offre de stage spécifique
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $post = Post::with('user')->findOrFail($id);

        
        
        return response()->json([
            'post' => $post
        ]);
    }

    /**
     * Mettre à jour une offre de stage
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        
        // Vérifier si l'utilisateur est autorisé
        if (Auth::id() !== $post->user_id) {
            return response()->json([
                'message' => 'Action non autorisée'
            ], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'domain' => 'sometimes|required|string|max:100',
            'date_debut' => 'sometimes|required|date',
            'date_fin' => 'sometimes|required|date|after:date_debut',
            'ville' => 'sometimes|required|string|max:100',
            'teletravail' => 'sometimes|boolean',
            'type_stage' => 'sometimes|required|string|max:100',
            'remunere' => 'sometimes|boolean',
            'montant_remuneration' => 'nullable|numeric|required_if:remunere,true',
            'competences' => 'sometimes|required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $post->update($request->all());

        return response()->json([
            'message' => 'Offre de stage mise à jour avec succès',
            'post' => $post
        ]);
    }

    /**
     * Supprimer une offre de stage
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        
        // Vérifier si l'utilisateur est autorisé
        if (Auth::id() !== $post->user_id) {
            return response()->json([
                'message' => 'Action non autorisée'
            ], 403);
        }
        
        $post->delete();

        return response()->json([
            'message' => 'Offre de stage supprimée avec succès'
        ]);
    }
    
    /**
     * Récupérer les offres de stage de l'utilisateur connecté
     *
     * @return \Illuminate\Http\Response
     */
    public function myPosts()
    {
        $posts = Post::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return response()->json([
            'posts' => $posts
        ]);
    }
}