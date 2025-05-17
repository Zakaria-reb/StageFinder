<?php
namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator; // Added missing import

class ApplicationController extends Controller
{
    /**
     * Récupérer les détails d'une candidature spécifique
     *
     * @param int $id ID de la candidature
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $application = Application::with([
                'post', 
                'user' => function($query) {
                    $query->select('id', 'name', 'email', 'telephone', 'ville', 'ecole', 
                                  'niveau_etudes', 'specialite', 'cv_path', 'avatar');
                }
            ])->findOrFail($id);
            
            // Vérifier si l'utilisateur est autorisé à voir cette candidature
            if (Auth::id() !== $application->user_id && Auth::id() !== $application->post->user_id) {
                return response()->json([
                    'message' => 'Action non autorisée'
                ], 403);
            }
            
            // Charger les informations supplémentaires selon le type d'utilisateur
            if (Auth::id() === $application->post->user_id) {
                // Si c'est le recruteur, charger plus d'informations sur le candidat
                $application->user->load(['competences', 'experiences', 'formations']);
            }
            
            return response()->json($application);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des détails de la candidature',
                'error' => $e->getMessage()
            ], 500);
        }
    }
   
    /**
     * Lister les candidatures d'un étudiant
     *
     * @return \Illuminate\Http\Response
     */
    public function myApplications()
    {
        try {
            // Chargement complet des relations nécessaires
            $applications = Application::with(['post.user', 'user'])
                ->where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();
                
            return response()->json($applications);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des candidatures',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lister les candidatures reçues pour les offres d'un recruteur
     *
     * @return \Illuminate\Http\Response
     */
    public function receivedApplications()
    {
        try {
            // Chargement complet des relations nécessaires
            $applications = Application::with(['post', 'user'])
                ->whereHas('post', function($query) {
                    $query->where('user_id', Auth::id());
                })
                ->orderBy('created_at', 'desc')
                ->get();
                
            return response()->json($applications);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des candidatures reçues',
                'error' => $e->getMessage()
            ], 500);
        }
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
        try {
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
            
            // Recharger l'application avec toutes les relations pour le retour
            $application->load(['post', 'user']);
            
            return response()->json([
                'message' => 'Statut de la candidature mis à jour avec succès',
                'application' => $application
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du statut',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Créer une nouvelle candidature
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'post_id' => 'required|exists:posts,id',
                'message' => 'nullable|string|max:5000',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Vérifier si l'utilisateur a déjà postulé
            $existingApplication = Application::where('user_id', Auth::id())
                ->where('post_id', $request->post_id)
                ->first();
                
            if ($existingApplication) {
                return response()->json([
                    'message' => 'Vous avez déjà postulé à cette offre'
                ], 409); // Conflict
            }
            
            $application = Application::create([
                'user_id' => Auth::id(),
                'post_id' => $request->post_id,
                'message' => $request->message,
                'status' => 'pending'
            ]);
            
            // Charger les relations pour le retour
            $application->load(['post', 'user']);
            
            return response()->json([
                'message' => 'Candidature soumise avec succès',
                'application' => $application
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création de la candidature',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Vérifier si un étudiant a déjà postulé à une offre
     *
     * @param int $postId
     * @return \Illuminate\Http\Response
     */
    public function checkApplicationStatus($postId)
    {
        try {
            $application = Application::where('user_id', Auth::id())
                ->where('post_id', $postId)
                ->first();
                
            if ($application) {
                return response()->json([
                    'hasApplied' => true,
                    'status' => $application->status
                ]);
            }
            
            return response()->json([
                'hasApplied' => false
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la vérification du statut',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}