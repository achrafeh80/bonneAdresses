# Bonnes Adresses

Ce projet est une application full-stack composée d'un backend Node.js et d'un frontend Expo (React Native). Voici le guide complet pour lancer l'application en local.

## Prérequis

* [Docker](https://www.docker.com/)
* [Node.js](https://nodejs.org/) (version recommandée >= 18)
* [npm](https://www.npmjs.com/)
* [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Installation et lancement

### 1. Lancer les services Docker

Depuis la racine du projet :

```bash
docker-compose up -d
```

### 2. Configurer le backend

```bash
cd backend
```

#### a. Créer le fichier de service Firebase

```bash
mkdir firebase-service-account.json
```

Copiez ensuite le contenu du fichier `bonnesadresses-8ec89-firebase-adminsdk-fbsvc-c482384758.json` dans le fichier `firebase-service-account.json`.

#### b. Installer les dépendances

```bash
npm install
```

#### c. Configurer la base de données

exécuter :

```bash
$env:MONGO_URI="mongodb://127.0.0.1:27017/mes-bonnes-adresses"
```

#### d. Remplir la base de données

```bash
npm run seed
```

#### e. Lancer le serveur en mode développement

```bash
npm run dev
```

### 3. Configurer et lancer le frontend

```bash
cd ../frontend
npx expo start
```

## Notes

* Assurez-vous que Docker est en cours d'exécution avant de lancer `docker-compose`.
* Le backend se connecte à MongoDB local via l'URI spécifié.
* Le frontend Expo peut être lancé sur un émulateur ou un appareil physique.

## Commandes utiles

* `docker-compose down` : Arrêter les services Docker.
* `npm run dev` : Lancer le backend en mode développement.
* `npm run seed` : Initialiser la base de données avec des données de test.
* `npx expo start` : Lancer le frontend Expo.

## Structure du projet

```
project-root/
│
├─ backend/
│  ├─ firebase-service-account.json
│  ├─ package.json
│  └─ ...
│
├─ frontend/
│  ├─ package.json
│  └─ ...
│
└─ docker-compose.yml
```

---

Avec ces instructions, vous devriez pouvoir lancer l'application complète et commencer le développement ou les tests en local.
