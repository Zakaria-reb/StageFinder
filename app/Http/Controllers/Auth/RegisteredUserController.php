<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        // Règles de validation de base
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'type' => ['required', 'string', 'in:etudiant,entreprise'],
            'telephone' => ['nullable', 'string', 'max:20'],
            'ville' => ['nullable', 'string', 'max:100'],
        ];
        
        // Règles spécifiques selon le type d'utilisateur
        if ($request->type === 'etudiant') {
            $rules['ecole'] = ['nullable', 'string', 'max:255'];
            $rules['niveau_etudes'] = ['nullable', 'string', 'max:50'];
            $rules['specialite'] = ['nullable', 'string', 'max:255'];
            $rules['cv'] = ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240']; // 10MB max
        } else if ($request->type === 'entreprise') {
            $rules['secteur_activite'] = ['nullable', 'string', 'max:255'];
            $rules['site_web'] = ['nullable', 'string', 'url', 'max:255'];
            $rules['adresse'] = ['nullable', 'string', 'max:255'];
        }
        
        $request->validate($rules);
        
        // Préparation des données de base pour la création de l'utilisateur
        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'type' => $request->type,
            'telephone' => $request->telephone,
            'ville' => $request->ville,
        ];
        
        // Ajouter les champs spécifiques selon le type d'utilisateur
        if ($request->type === 'etudiant') {
            $userData['ecole'] = $request->ecole;
            $userData['niveau_etudes'] = $request->niveau_etudes;
            $userData['specialite'] = $request->specialite;
            
            // Gestion du CV
            if ($request->hasFile('cv') && $request->file('cv')->isValid()) {
                $cvPath = $request->file('cv')->store('cv', 'public');
                $userData['cv_path'] = $cvPath;
            }
        } else if ($request->type === 'entreprise') {
            $userData['secteur_activite'] = $request->secteur_activite;
            $userData['site_web'] = $request->site_web;
            $userData['adresse'] = $request->adresse;
        }
        
        // Création de l'utilisateur
        $user = User::create($userData);
        
        // Déclencher l'événement d'inscription
        event(new Registered($user));
        
        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie'
        ]);
    }
}