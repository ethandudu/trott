# trott

# Prisma

> ⚠️ Ce guide supprime toutes les migrations et données existantes pour repartir de zéro avec un schéma propre.


### 🧱 1. Supprimer les anciennes migrations

Dans le dossier du projet :

```bash
rm -rf prisma/migrations
```


### 💣 2. Réinitialiser la base de données (⚠️ destructif)

> Cela supprime toutes les tables existantes et recrée la base selon le schéma Prisma actuel.

```bash
npx prisma db push --force-reset
```


### 🧪 3. (Optionnel) Générer une migration propre

Pour créer un historique versionné des migrations (utile pour staging/production) :

```bash
npx prisma migrate dev --name init
```


### 🌱 4. Lancer le script de seed

> Ce script crée un utilisateur et une trottinette avec une clé API.

```bash
npm run seed
```

### 📂 Arborescence attendue

```
project-root/
├─ prisma/
│  ├─ schema.prisma
│  ├─ seed.ts
├─ .env
├─ package.json
├─ tsconfig.json
└─ ...
```
