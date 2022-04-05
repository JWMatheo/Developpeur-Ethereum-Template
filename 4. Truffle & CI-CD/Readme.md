# test unitaire Voting

En premier lieu j'ai organisé mon code avec des "describe" pour chaque étapes du vote 
en fonction de l'ordre d'arrivé dans le smart contract. J'ai cherhché à factoriser au 
mieux dans les "beforeEach" pour gagner du temps et de la lisibilité.




Dans 'Registration' on vérifie que :




-le voter soit bien enregistré,

-le voter ne peut soumettre de proposition,

-le voter n'est pas ajouté 2 fois.





Dans 'PROPOSAL' on vérifie que :




-la proposition soit bien ajouté,

-la proposition ne soit pas vide,

-si la phase de soumission des propositions est fermée le voter ne peut soumettre de proposition.





Dans 'get' on vérifie que :




-la fonction retourne bien la structure Voter du voter,

-la fonction retourne bien la structure Proposal du voter.





Dans 'VOTE' on vérifie que :




-chaques arguments de la structure Voter correspondent à ceux du voter,

-si la phase de vote est fermée le voter ne peut pas voter,

-le voter ne puisse pas voter 2 fois,

-la proposition existe.




Dans 'tallyVotes' on vérifie que :




-la proposition avec le plus de vote est la proposition gagnante,
-si la phase de comptage des votes est fermée on ne compte pas




Dans 'tests des event, du require des fonctions workflow' on vérifie que :




-les différents états du contrats se modifient correctement en fonction de la fonction appellée,
-Si on appelle une fonction changeant l'état alors que celui-ci n'est pas censé intervenir l'état n'est pas modifié.




Dans 'tests des event, du require des enum' on vérifie que :




-
