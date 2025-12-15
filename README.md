# API Véhicules

---

## Prérequis
- Node.js 18+
- npm
- MongoDB local
- MongoDB Database Tools (`mongoimport`)

---

## Installation locale

```bash
git clone https://github.com/Victo-2339566/api-vehicule-v2.git
cd api-vehicule-v2
npm install
```

fichier `.env.development` est deja dans le repo 


Démarrer l’API :
```bash
npm run dev
```

---

## Création et alimentation de la base de données

La base de données et la collection sont créées automatiquement par MongoDB lors de la première insertion via mongoimport.

### Import des données 

Les données de test se trouvent dans :
- `dev/db/vehiculesDB.users.json`
- `dev/db/vehiculesDB.vehicules.json`


```bash
mongoimport --uri "$MONGODB_URI" --collection users --file dev/db/vehiculesDB.users.json --jsonArray
mongoimport --uri "$MONGODB_URI" --collection vehicules --file dev/db/vehiculesDB.vehicules.json --jsonArray
```

---

## API publiée
- https://api-vehicule-v2-dcakf9dmhtgwefbq.canadacentral-01.azurewebsites.net
