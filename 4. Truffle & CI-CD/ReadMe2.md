# test unitaire Voting

## Unit tests
35 tests validés

Toutes les fonctions du contrats sont testées

1 file Voting.js

### 1) Registration

- "...should set a new voter mapping"

- "...should not take any proposal"

- "...cannot be added twice"

### 2) PROPOSAL

- "...should have a proposal"

- "...should have something to propose"

- "...should not take any proposal"

### 3) get

- "...should get voter, check for isRegistered"

- "...should get voter, check for hasVoted"

- "...should get voter, check for votedProposalId"

- "...should get proposal, check description"

- "...should get proposal, check voteCount"

### 4) VOTE

- "...verify proposal Id"

- "...verify hasVoted is true"

- "...verify voteCount++"

- "...should not be able to vote"

- "...cannot vote 2 times"

- "...cannot vote if proposal doesn't exist"

### 5) tallyVotes

- "...verify winningProposal"
- "...should not be able to tally"

### 6) tests des event, du require des fonctions workflow


- 'switch to ProposalsRegistrationStarted'
- 'should not switch to ProposalsRegistrationStarted'
- 'switch to endProposalsRegistering'
- 'should not switch to endProposalsRegistering'
- 'switch to startVotingSession'
- 'should not switch to startVotingSession'
- 'switch to endVotingSession'
- 'should not switch to endVotingSession'

### 7) Event triggering

- 'should add voter, get event VoterRegistered'
- 'get event workflowStatus change for startProposalsRegistering'
- 'should add Proposal, get event ProposalRegistered'
- 'get event workflowStatus change for endProposalsRegistering'
- 'get event workflowStatus change for startVotingSession'
- 'should set Vote, get event ProposalRegistered'
- 'get event workflowStatus change for endVotingSession'
- 'should tallyVotes, get event ProposalRegistered'
