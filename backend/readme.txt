Il est nécessaire d'installer tous les modules pour utiliser l'application.
A partir de dossier backend, inscrire npm install à partir du terminal.
Également, il faut configurer le ficher .env en renseignant les différents paramètres demandés.

Concernant la validation de l'email et du mot de passe utilisateur :

- Pour l'email, la validation est definie par isEmail du validator. exemple : (validator.isEmail('foo@bar.com'); => true)
- Pour le mot de passe, la validation est définie par un regex implémenté dans le controller users.
  Il doit comporter au moins 6 caractère dont un chiffre.

