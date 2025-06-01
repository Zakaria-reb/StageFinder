# StageFinder

StageFinder est une application web combinant **Laravel** pour le backend et **React** pour le frontend. Elle a pour but de simuler une plateforme de recherche de stage, inspirée de LinkedIn.

---

## 🚀 Installation locale du projet (Laravel + React)

Suivez les étapes ci-dessous pour installer et exécuter le projet localement.

### 🔧 Prérequis

Avant de commencer, assurez-vous d’avoir installé :

* PHP ≥ 8.1
* Composer
* Node.js & npm
* Git
* Un serveur local (XAMPP, Laragon, Valet...)
* Un SGBD comme MySQL ou MariaDB

---

### 🛠️ Etapes d'installation

1. **Cloner le projet et accéder au dossier :**

   ```bash
   git clone https://github.com/nom-utilisateur/stagefinder.git
   cd stagefinder
   ```

2. **Installer les dépendances Laravel :**

   ```bash
   composer install
   ```

3. **Configurer l’environnement :**

   * Copier le fichier `.env.example` en `.env` :

     ```bash
     cp .env.example .env
     ```
   * Modifier les variables suivantes dans `.env` :

     ```
     DB_DATABASE=StageFinder
     DB_USERNAME=root
     DB_PASSWORD=
     ```

4. **Générer la clé de l'application et lier le dossier de stockage :**

   ```bash
   php artisan key:generate
   php artisan storage:link
   ```

5. **Créer la base de données manuellement** (via phpMyAdmin ou ligne de commande).

6. **Exécuter les migrations de base de données :**

   ```bash
   php artisan migrate
   ```

7. **Installer les dépendances React :**

   ```bash
   cd frontend
   npm install
   ```

8. **Démarrer les serveurs de développement :**

   * Backend Laravel :

     ```bash
     php artisan serve
     ```

   * Frontend React (dans le dossier `frontend`) :

     ```bash
     npm run dev
     ```

---

### ✅ Accès à l’application

* Backend Laravel : [http://localhost:8000](http://localhost:8000)
* Frontend React : [http://localhost:5173](http://localhost:5173) (ou selon le port affiché)

---

## 🧰 Technologies utilisées

* **Backend** : Laravel 10.x
* **Frontend** : React 18 + Vite
* **Base de données** : MySQL
* **Autres** : Composer, npm, PHP artisan

---

## 👨‍💻 Auteur

Ce projet a été réalisé dans le cadre d’un exercice de développement web fullstack par ZAKARIA REBBAH & SOUHAIB SELLAB.

---

## 📄 Licence

Ce projet est à usage éducatif uniquement.
