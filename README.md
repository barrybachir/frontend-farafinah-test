# Gallery — Galerie d'images avec authentification

Application Next.js (App Router) avec authentification, galerie Unsplash, recherche/filtres et système de likes persistant (fichier JSON via `lowdb`).

## Guide d'instalation et lancement du projet

## Installation
## Prerequis

- Node.js 18+ recommande
- npm

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Comptes de test

| Identifiant | Mot de passe | Résultat |
|-------------|-------------|---------|
| muser1 | mpassword1 | Connexion réussie |
| muser2 | mpassword2 | Connexion réussie |
| muser3 | mpassword3 | Compte bloqué |
| autre | autre | Identifiants invalides |



## Structure du projet

```
pixelboard/
├── app/
│   ├── layout.tsx          # Layout racine
│   ├── page.tsx            # Redirection vers /login
│   ├── login/
│   │   └── page.tsx        # Page de connexion
│   ├── gallery/
│   │   └── page.tsx        # Galerie d'images (protégée)
│   └── api/
│       ├── photos/
│       │   └── route.ts    # Proxy API Unsplash
│       └── likes/
│           └── route.ts    # Toggle likes (stockage via lowdb)
├── components/
│   ├── LoginForm.tsx       # Formulaire de connexion
│   ├── PhotoCard.tsx       # Carte image avec like
│   ├── Gallery.tsx         # Grille de photos
│   ├── GalleryShell.tsx    # Orchestration (Navbar + Gallery + compteur likes)
│   └── Navbar.tsx          # Barre de navigation
├── lib/
│   ├── auth.ts             # Logique d'authentification
│   ├── db.ts               # Stockage persistant des likes (lowdb -> .data/likes.json)
│   └── unsplash.ts         # Client API Unsplash
├── public/
│   └── images/
│       └── login-illustration.png
└── styles/
    └── globals.css         # Styles globaux Tailwind
```

## Choix techniques

- **Next.js 14 (App Router)** : pages serveur (`app/*`) + routes API (`app/api/*`).
- **UI en React (Client Components)** : interactivité dans `components/*` (likes, recherche auto, infinite scroll).
- **Persistance des likes via `lowdb`** : stockage simple en fichier JSON `/.data/likes.json` .
- **Sessions via cookies** : la session est portée par un cookie (côté serveur), ce qui permet de protéger `/gallery`.
- **Proxy Unsplash côté serveur** : la clé API Unsplash reste côté serveur, le client appelle seulement `/api/photos`.
- **Infinite scroll + recherche auto** : `IntersectionObserver` + debounce sur la saisie.
- **Filtres** : orientation + tri (paramètres envoyés à `/api/photos`).

## Fonctionnement essentiel 
### Authentification
- **Page** : `app/login/page.tsx` affiche `LoginForm`.
- **API** : `app/api/auth/login/route.ts` valide les identifiants et crée la session (cookie).
- **Protection** : `app/gallery/page.tsx` utilise `requireAuth()` pour rediriger vers `/login` si non connecté.

### Chargement des photos (Unsplash)
- **Client** : `components/Gallery.tsx` appelle `GET /api/photos?page=...&per_page=...` (+ `query`, `sort`, `orientation`).
- **Serveur** : `app/api/photos/route.ts` appelle Unsplash via `lib/unsplash.ts`.
- **Pourquoi un proxy ?** Pour éviter d’exposer `UNSPLASH_ACCESS_KEY` côté navigateur.

### Recherche + filtres
- **Recherche auto** : dès tapes, une requête part après ~350ms (debounce) pour éviter trop d’appels.
- **Filtres** : orientation et tri sont envoyés en query params à `/api/photos`.

### Likes (persistance)
- **UI** : `components/PhotoCard.tsx` envoie `POST /api/likes` pour liker/déliker.
- **Stockage** : `lib/db.ts` persiste les likes par utilisateur dans `/.data/likes.json`.
- **Compteur** : `components/GalleryShell.tsx` centralise `likeCount` pour mettre à jour la `Navbar` en temps réel.




