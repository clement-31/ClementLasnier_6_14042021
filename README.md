# Projet 6 du parcours Développeur web d'OpenClassrooms : Construire une API sécurisée pour une application d'avis gastronomiques

Il s'agit du MVP d'une application d'évaluation de sauces piquantes ; la partie front-end est fournie et la partie back-end ainsi que l'API sont à développer.


## Compétences évaluées :
- Implémenter un modèle logique de données conformément à la réglementation
- Stocker des données de manière sécurisée
- Mettre en œuvre des opérations CRUD de manière sécurisée

### Spécifications techniques

Les données des utilisateurs doivent parfaitement protégées.
Pour cela, l’API utilisée devra impérativement respecter des pratiques de code sécurisé.

L’API doit respecter le RGPD et les standards OWASP ;
● le mot de passe des utilisateurs doit être chiffré ;
● 2 types de droits administrateur à la base de données doivent être définis : un accès
pour supprimer ou modifier des tables, et un accès pour éditer le contenu de la base
de données ;
● la sécurité de la base de données MongoDB (à partir d’un service tel que MongoDB
Atlas) doit être faite de telle sorte que le validateur puisse lancer l’application depuis
sa machine ;
● l’authentification est renforcée sur les routes requises ;
● les mots de passe sont stockés de manière sécurisée ;
● les adresses mails de la base de données sont uniques et un plugin Mongoose
approprié est utilisé pour s’assurer de leur caractère unique et rapporter des erreurs.

### Technologies utilisées 

● framework : Express ;
● serveur : NodeJS ;
● base de données : MongoDB ;
Toutes les opérations de la base de données doivent utiliser le pack Mongoose avec
des schémas de données stricts.


