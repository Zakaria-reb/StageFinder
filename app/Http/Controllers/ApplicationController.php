<?php
namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

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
            // Chargement de base sans relations
            $application = Application::find($id);
            
            if (!$application) {
                return response()->json(['message' => 'Application not found'], 404);
            }

            // Chargement progressif des relations
            if (!$application->post) {
                return response()->json(['message' => 'Associated post not found'], 404);
            }

            if (!$application->post->user) {
                return response()->json(['message' => 'Post author not found'], 404);
            }

            if (!$application->user) {
                return response()->json(['message' => 'Applicant user not found'], 404);
            }

            // Autorisations
            if (Auth::id() !== $application->user_id && Auth::id() !== $application->post->user_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Si c'est l'entreprise qui consulte la candidature d'un étudiant
            if (Auth::id() === $application->post->user_id) {
                // Sélectionner uniquement les champs spécifiés pour l'étudiant
                $studentData = $application->user->only([
                    'id',
                    'name',
                    'ecole',
                    'niveau_etudes',
                    'specialite',
                    'cv_path',
                    'email',
                    'ville'
                ]);
                
                // Créer la réponse avec les données filtrées
                $response = [
                    'id' => $application->id,
                    'post_id' => $application->post_id,
                    'user_id' => $application->user_id,
                    'status' => $application->status,
                    'message' => $application->message,
                    'created_at' => $application->created_at,
                    'updated_at' => $application->updated_at,
                    'post' => $application->post,
                    'user' => $studentData
                ];
                
                return response()->json($response);
            }

            // Si c'est l'étudiant qui consulte sa propre candidature
            return response()->json($application->load(['post.user']));

        } catch (\Exception $e) {
            Log::error('Application details error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Error details: ' . $e->getMessage() // Retour temporaire
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
            $applications = Application::with(['post.user', 'user'])
                ->where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();
                
            return response()->json($applications);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des candidatures', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Erreur lors de la récupération des candidatures'
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
            $applications = Application::with(['post', 'user' => function($query) {
                // Sélectionner uniquement les champs nécessaires pour l'entreprise
                $query->select('id', 'name', 'ecole', 'niveau_etudes', 'specialite', 'cv_path', 'email', 'ville');
            }])
                ->whereHas('post', function($query) {
                    $query->where('user_id', Auth::id());
                })
                ->orderBy('created_at', 'desc')
                ->get();
                
            return response()->json($applications);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des candidatures reçues', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Erreur lors de la récupération des candidatures reçues'
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
            
            $application = Application::with('post')->find($id);
            
            if (!$application) {
                return response()->json([
                    'message' => 'Candidature introuvable'
                ], 404);
            }
            
            if (!$application->post) {
                return response()->json([
                    'message' => 'L\'offre associée à cette candidature est introuvable'
                ], 404);
            }
            
            // Vérifier si l'utilisateur est le propriétaire de l'offre
            if ($application->post->user_id !== Auth::id()) {
                return response()->json([
                    'message' => 'Action non autorisée'
                ], 403);
            }
            
            $application->status = $request->status;
            $application->save();
            
            // Recharger l'application avec les relations filtrées pour le retour
            $application->load(['post', 'user' => function($query) {
                $query->select('id', 'name', 'ecole', 'niveau_etudes', 'specialite', 'cv_path', 'email', 'ville');
            }]);
            
            return response()->json([
                'message' => 'Statut de la candidature mis à jour avec succès',
                'application' => $application
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du statut', [
                'application_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du statut'
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
                ], 409);
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
            Log::error('Erreur lors de la création de la candidature', [
                'user_id' => Auth::id(),
                'post_id' => $request->post_id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Erreur lors de la création de la candidature'
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
            Log::error('Erreur lors de la vérification du statut', [
                'user_id' => Auth::id(),
                'post_id' => $postId,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Erreur lors de la vérification du statut'
            ], 500);
        }
    }

    /**
     * Supprimer une candidature (pour les recruteurs)
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $application = Application::with('post')->find($id);
            
            if (!$application) {
                return response()->json([
                    'message' => 'Candidature introuvable'
                ], 404);
            }
            
            if (!$application->post) {
                return response()->json([
                    'message' => 'L\'offre associée à cette candidature est introuvable'
                ], 404);
            }
            
            // Vérifier si l'utilisateur est le propriétaire de l'offre
            if ($application->post->user_id !== Auth::id()) {
                return response()->json([
                    'message' => 'Action non autorisée'
                ], 403);
            }
            
            $application->delete();
            
            return response()->json([
                'message' => 'Candidature supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression de la candidature', [
                'application_id' => $id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Erreur lors de la suppression de la candidature'
            ], 500);
        }
    }
}