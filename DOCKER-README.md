# Docker Setup for MPMT Application

Ce document explique comment démarrer l'application MPMT en utilisant Docker.

## Structure de l'application

L'application MPMT est divisée en trois parties principales :

1. **Frontend** : Une application Angular
2. **Backend** : Une API Spring Boot
3. **Base de données** : MySQL pour le stockage des données

## Prérequis

- Docker et Docker Compose installés sur votre machine
- Ports 8081 (frontend), 8080 (backend), 3306 (MySQL) et 8082 (phpMyAdmin) disponibles

## Configuration

L'application utilise les fichiers suivants pour la configuration Docker :

- `docker-compose.yml` : Orchestration des services
- `client/Dockerfile` : Configuration de build pour le frontend Angular
- `client/nginx.conf` : Configuration de Nginx pour servir l'application Angular et faire le proxy vers le backend
- `mpmt/Dockerfile` : Configuration de build pour le backend Spring Boot
- `init.sql` : Script d'initialisation de la base de données

Les budgets de taille des fichiers ont été augmentés dans `angular.json` pour permettre la compilation de l'application, car certains composants ont des fichiers SCSS qui dépassaient les limites par défaut.

## Démarrage rapide

1. Lancez l'application avec le script de démarrage :

```bash
./start.sh
```

Ou exécutez directement :

```bash
docker-compose up -d
```

2. Accédez à l'application :
   - Frontend : http://localhost:8081
   - Backend API : http://localhost:8080
   - phpMyAdmin : http://localhost:8082

3. Utilisez les identifiants par défaut :
   - Email : admin@mpmt.com
   - Mot de passe : admin123

## Gestion des conteneurs

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique (frontend, backend ou db)
docker-compose logs -f frontend
```

### Arrêter l'application
```bash
docker-compose down
```

### Réinitialiser complètement (supprimer les volumes)
```bash
docker-compose down -v
```

## Persistance des données

Les données de MySQL sont stockées dans un volume Docker nommé `mysql-data` pour garantir leur persistance entre les redémarrages.

## Environnement de développement

Pour travailler en mode développement tout en utilisant la base de données dans Docker :

1. Démarrez uniquement le service de base de données :
```bash
docker-compose up -d db
```

2. Configurez votre application Spring Boot pour se connecter à la base de données sur localhost:3306
3. Démarrez votre application frontend avec `npm start` et le backend avec votre IDE
