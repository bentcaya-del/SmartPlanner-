# SmartPlanner

A full-stack task planner that turns a simple to-do list into an automatically generated daily schedule, ordered by priority.
*Application full-stack qui transforme une liste de tâches en planning quotidien généré automatiquement, selon la priorité de chaque tâche.*

## Fonctionnalités

- Ajouter une tâche avec un nom, une durée (en heures) et une priorité (`haute`, `moyenne`, `basse`)
- Supprimer une tâche
- Lister les tâches, triées par priorité
- Générer automatiquement un planning de la journée : les tâches sont ordonnées par priorité puis placées les unes après les autres à partir de 8h00
- Persistance des données côté serveur (fichier `tasks.json`)

## Stack technique

**Backend**
- Node.js + Express 5
- CORS
- Persistance simple en JSON (`fs/promises`)

**Frontend**
- Vite
- JavaScript vanilla, HTML, CSS

## Structure du projet

```
SmartPlanner/
├── backend/
│   ├── server.js       # API Express (tasks + génération du planning)
│   ├── tasks.json       # Stockage des tâches
│   └── package.json
└── frontend/
    ├── index.html
    ├── src/
    │   └── main.js      # Logique d'affichage et appels à l'API
    ├── style.css
    └── package.json
```

## Installation & lancement

### 1. Cloner le repo

```bash
git clone https://github.com/bentcaya-del/SmartPlanner.git
cd SmartPlanner
```

### 2. Backend (API — http://localhost:5000)

```bash
cd backend
npm install
npm run dev      # avec nodemon, ou "npm start" en simple
```

### 3. Frontend (interface — http://localhost:5173)

```bash
cd frontend
npm install
npm run dev
```

Ouvre ensuite l'URL affichée dans le terminal (par défaut `http://localhost:5173`).

> Le backend doit être lancé avant le frontend pour que l'application fonctionne correctement.

## API

| Méthode | Route          | Description                                        |
|---------|----------------|-----------------------------------------------------|
| GET     | `/`            | Vérifie que le serveur répond                        |
| GET     | `/tasks`       | Liste toutes les tâches                              |
| POST    | `/tasks`       | Ajoute une tâche `{ nom, duree, priorite }`          |
| DELETE  | `/tasks/:id`   | Supprime une tâche                                   |
| GET     | `/schedule`    | Génère le planning du jour, trié par priorité        |

## Pistes d'amélioration

- Modifier une tâche existante
- Choisir l'heure de début de journée (actuellement fixée à 8h00)
- Persistance via une vraie base de données
- Déploiement (frontend sur GitHub Pages / Vercel, backend sur Render)
- Tests automatisés

## Auteur

Projet réalisé par **Ben-tchichia Aya**
