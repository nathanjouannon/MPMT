# Tests Frontend avec Karma et Jasmine

Ce projet utilise Karma et Jasmine pour les tests unitaires du frontend Angular.

## Installation

Les dépendances de test sont déjà incluses dans le projet.

## Configuration

Le projet est configuré avec Karma et Jasmine pour Angular, qui sont les outils de test par défaut pour Angular.

## Exécuter les tests

Pour exécuter les tests unitaires:

```bash
npm test
```

Pour exécuter les tests sans ouvrir un navigateur (utile pour CI/CD):

```bash
npm test -- --no-watch --browsers=ChromeHeadless
```

Pour générer un rapport de couverture:

```bash
npm run test:coverage
```

Le rapport de couverture sera généré dans le dossier `coverage` et affichera également un résumé dans la console.

## Guide pour corriger les erreurs courantes

### Injection de ToastrService

```typescript
TestBed.configureTestingModule({
  imports: [
    ComponentToTest,
    // ...autres imports
  ],
  providers: [
    { 
      provide: ToastrService, 
      useValue: {
        success: jasmine.createSpy('success'),
        error: jasmine.createSpy('error'),
        info: jasmine.createSpy('info'),
        warning: jasmine.createSpy('warning')
      } 
    }
  ]
})
```

### Injection de HttpClient

```typescript
TestBed.configureTestingModule({
  imports: [
    ComponentToTest,
    HttpClientTestingModule
  ]
})
```

### Injection de ActivatedRoute

```typescript
TestBed.configureTestingModule({
  imports: [
    ComponentToTest,
    RouterTestingModule
  ],
  providers: [
    {
      provide: ActivatedRoute,
      useValue: {
        snapshot: { paramMap: { get: () => '1' } }
      }
    }
  ]
})
```

## Structure des tests

Les tests sont organisés de la même manière que le code source. Pour chaque fichier de code, il existe un fichier de test correspondant avec l'extension `.spec.ts`.

### Exemples de tests:

1. **Modèle (task.model.spec.ts)**
   - Test des interfaces et de leurs propriétés
   - Validation des valeurs énumérées

2. **Composants (app.component.spec.ts, login-page.component.spec.ts)**
   - Test de création de composant
   - Test des méthodes du composant
   - Test des interactions utilisateur
   - Test des rendus conditionnels

3. **Guards (auth.guard.spec.ts)**
   - Test de logique d'autorisation
   - Test de redirection

## Couverture de code

L'objectif de couverture de code est fixé à 60% pour les lignes, branches, fonctions et instructions. Vous pouvez voir votre couverture actuelle en exécutant `npm run test:coverage`.
