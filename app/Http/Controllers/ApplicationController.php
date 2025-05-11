<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    /**
     * Enregistrer une nouvelle candidature à un stage
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'post_id' => 'required|exists:posts,id',
            'message' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier si l'utilisateur a déjà postulé à cette offre
        $existingApplication = Application::where('user_id', Auth::id())
            ->where('post_id', $request->post_id)
            ->first();

        if ($existingApplication) {
            return response()->json([
                'message' => 'Vous avez déjà postulé à cette offre de stage'
            ], 422);
        }
        
        // Vérifier si l'utilisateur est le propriétaire de l'offre
        $post = Post::findOrFail($request->post_id);
        if ($post->user_id === Auth::id()) {
            return response()->json([
                'message' => 'Vous ne pouvez pas postuler à votre propre offre de stage'
            ], 422);
        }

        $application = Application::create([
            'post_id' => $request->post_id,
            'user_id' => Auth::id(),
            'status' => 'pending',
            'message' => $request->message ?? null,
        ]);

        return response()->json([
            'message' => 'Candidature envoyée avec succès',
            'application' => $application
        ], 201);
    }

    /**
     * Vérifier si l'utilisateur a déjà postulé à une offre
     * 
     * @param int $postId ID de l'offre de stage
     * @return \Illuminate\Http\Response
     */
    public function checkApplicationStatus($postId)
    {
        $hasApplied = Application::where('user_id', Auth::id())
            ->where('post_id', $postId)
            ->exists();
            
        return response()->json([
            'hasApplied' => $hasApplied
        ]);
    }

    /**
     * Lister les candidatures d'un étudiant
     *
     * @return \Illuminate\Http\Response
     */
    public function myApplications()
    {
        $applications = Application::with('post.user')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return response()->json([
            'applications' => $applications
        ]);
    }

    /**
     * Lister les candidatures reçues pour les offres d'un recruteur
     *
     * @return \Illuminate\Http\Response
     */
    public function receivedApplications()
    {
        $applications = Application::with(['post', 'user'])
            ->whereHas('post', function($query) {
                $query->where('user_id', Auth::id());
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return response()->json([
            'applications' => $applications
        ]);
    }

    /**
     * Changer le statut d'une candidature (pour les recruteurs)
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,accepted,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $application = Application::with('post')->findOrFail($id);
        
        // Vérifier si l'utilisateur est le propriétaire de l'offre
        if ($application->post->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Action non autorisée'
            ], 403);
        }
        
        $application->status = $request->status;
        $application->save();

        return response()->json([
            'message' => 'Statut de la candidature mis à jour avec succès',
            'application' => $application
        ]);
    }
}