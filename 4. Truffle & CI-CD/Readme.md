# test unitaire Voting

En premier lieu j'ai organisé mon code avec des "describe" pour chaque étapes du vote 
en fonction de l'ordre d'arrivé dans le smart contract. J'ai cherhché à factoriser au 
mieux dans les "beforeEach" pour gagner du temps et de la lisibilité.

Dans 'Registration' on vérifie que :


-le voter soit bien enregistré,

-la phase d'enregistrement soit ouverte,

-le voter n'est pas ajouté 2 fois.

Dans 'PROPOSAL' on vérifie que :


-la proposition soit bien ajouté,

-la proposition ne soit pas vide,

-la phase de soumission des propositions soit ouverte.

Dans 'get' on vérifie que :


-la fonction retourne bien la structure Voter du voter,

-la fonction retourne bien la structure Proposal du voter.

Dans 'VOTE' on vérifie que :


-chaques arguments de la structure Voter correspondent à ceux du voter,

-la phase de vote soit ouverte,

-le voter ne puisse pas voter 2 fois,

-la proposition existe.

