Concernant la validation de l'email et du mot de passe utilisateur :

- Pour l'email, la validation est definie par isEmail du validator. exemple : (validator.isEmail('foo@bar.com'); => true)
- Pour le mot de passe, la validation est définie par un regex implémenté dans le controller users.
  Il doit comporter au moins 6 caractère dont un chiffre.

Pour que l'application fonctionne, il faut d'abord configuré le ficher .env en renseignant les différents paramètres demandés.