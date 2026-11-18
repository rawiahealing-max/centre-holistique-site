# Centre Holistique - Backend (Node.js + Express + SQLite)

Backend complet pour la plateforme de formation et soins énergétiques de Raouia Gharbal.

## Fonctionnalités
- Authentification JWT (Admin/Student)
- Gestion des cours avec lien Telegram
- Rendez-vous (En ligne / Au Cabinet Sfax Tunis)
- Paiements & accès aux cours
- Upload de fichiers (MP3, PDF, images)
- Tableau de bord admin

## Lancer localement
1. `npm install`
2. `npm run dev` (ou `npm start`)
3. Visitez `http://localhost:3000`

## Admin par défaut
- Email: admin@centreholistique.com
- Mot de passe: raouia2026

## Production
Déployez sur Render.com ( gratuit ) : créez un "Web Service" avec le repository GitHub, le start command `npm start`, et ajoutez un environment variable `NODE_ENV=production`.