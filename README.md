# Projet 6 du parcours Développeur web d'OpenClassrooms : Construire une API sécurisée pour une application d'avis gastronomiques

Il s'agit du MVP d'une application d'évaluation de sauces piquantes ; la partie front-end est fournie et la partie back-end ainsi que l'API sont à développer.


## Compétences évaluées :
- Implémenter un modèle logique de données conformément à la réglementation
- Stocker des données de manière sécurisée
- Mettre en œuvre des opérations CRUD de manière sécurisée

### Spécifications techniques

Les données des utilisateurs doivent parfaitement protégées.
Pour cela, l’API utilisée devra impérativement respecter des pratiques de code sécurisé.

L’API doit respecter le RGPD et les standards OWASP :
- le mot de passe des utilisateurs doit être chiffré ;
- 2 types de droits administrateur à la base de données doivent être définis : un accès
pour supprimer ou modifier des tables, et un accès pour éditer le contenu de la base
de données ;
- la sécurité de la base de données MongoDB (à partir d’un service tel que MongoDB
Atlas) doit être faite de telle sorte que le validateur puisse lancer l’application depuis
sa machine ;
- l’authentification est renforcée sur les routes requises ;
- les mots de passe sont stockés de manière sécurisée ;
- les adresses mails de la base de données sont uniques et un plugin Mongoose
approprié est utilisé pour s’assurer de leur caractère unique et rapporter des erreurs.

### Technologies utilisées 

- framework : Express ;
- serveur : NodeJS ;
- base de données : MongoDB ;
Toutes les opérations de la base de données doivent utiliser le pack Mongoose avec
des schémas de données stricts.

### Installation et lancement

- Cloner le projet
- Ajouter un fichier nommé ".env" dans le dossier backend avec le contenu suivant :
- Authentification
JWT_SECRET_TOKEN="RANDOM_KEY"

  dburi
database='mongodb+srv://newuserP6:P6Xolosa31@clusterp6.whu2r.mongodb.net/Projet6OC?retryWrites=true&w=majority'
- Ouvrir un terminal côté backend et saisir "npm install", puis "nodemon server" ; l'écoute se fait sur le port 3000 et la connexion à MongoDB est établie
- Ouvrir un nouveau terminal côté frontend et saisir successivement "npm install" puis "npm start" dans la fenêtre de commande
- Saisir "ng serve" ; l'écoute se fait sur le port 4200 (ouvrir la page http://localhost:4200 dans le navigateur internet)

