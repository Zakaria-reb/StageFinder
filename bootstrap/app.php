<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Important: Ajouter StartSession middleware à toutes les requêtes API
        $middleware->appendToGroup('api', \Illuminate\Session\Middleware\StartSession::class);
        $middleware->appendToGroup('api', \Illuminate\View\Middleware\ShareErrorsFromSession::class);
        
        // Assurez-vous que ce middleware est toujours actif pour l'API
        $middleware->alias([
            'auth.session' => \Illuminate\Session\Middleware\AuthenticateSession::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();