const Voting = artifacts.require("./Voting.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
// Pour events dans before pas .new mais .deployed()
contract('Voting', accounts => {
    // Définition des variables globales
    const owner = accounts[0];
    const second = accounts[1];
    const third = accounts[2];
    let VotingInstance;
    describe('REGISTRATION', () => {
        beforeEach(async function() {
            VotingInstance = await Voting.new({from:owner}); // Création d'une instance
            await VotingInstance.addVoter(owner, {from:owner}); // utiliser une fonction
        })
        it("...should set a new voter mapping", async () => {           
            const storedData = await VotingInstance.voters(owner); // Selectioner un mapping
            expect(storedData.isRegistered).to.equal(true); // verifier string dans mapping
        })
        it("...should not take any proposal", async () => {  
            await VotingInstance.startProposalsRegistering({from:owner}); 
            await expectRevert(VotingInstance.addVoter(owner, {from:owner}), 'Voters registration is not open yet')
        })
        it("...cannot be added twice", async () => {  
            await expectRevert(VotingInstance.addVoter(owner, {from:owner}), 'Already registered')
        })
    })
    describe('PROPOSAL', () => {
        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner}); // Création d'une instance
            await VotingInstance.addVoter(owner, {from:owner});
                      
        })
        it("...should have a proposal", async () => {
            await VotingInstance.startProposalsRegistering({from:owner});   
            await VotingInstance.addProposal('Jojo est le meilleur manga', {from:owner}); // utiliser une fonction        
            const storedData = await VotingInstance.proposalsArray(0); // Selectioner un array
            expect(storedData.description).to.equal('Jojo est le meilleur manga'); // verifier string dans array
        })
        it("...should have something to propose", async () => { 
            await VotingInstance.startProposalsRegistering({from:owner});  
            await expectRevert(VotingInstance.addProposal('', {from:owner}), 'Vous ne pouvez pas ne rien proposer')                    
        })
        it("...should not take any proposal", async () => {   
            await expectRevert(VotingInstance.addProposal('Jojo est le meilleur manga', {from:owner}), 'Proposals are not allowed yet')
        })
    })
    describe('get', () => {
        beforeEach(async function() {
            VotingInstance = await Voting.new({from:owner}); // Création d'une instance
            await VotingInstance.addVoter(owner, {from:owner}); // utiliser une fonction
            await VotingInstance.startProposalsRegistering({from:owner});
            await VotingInstance.addProposal('Jojo est le meilleur manga', {from:owner});
        })
        it("...should get voter", async () => {
            const storedData = await VotingInstance.getVoter(owner, {from:owner}); // utiliser une fonction          
            expect(storedData.isRegistered).to.equal(true); 
        })
        it("...should get proposal", async () => {
            const storedData = await VotingInstance.getOneProposal(0, {from:owner}); // utiliser une fonction          
            expect(storedData.description).to.equal('Jojo est le meilleur manga'); 
        })
    })
    describe('VOTE', () => {
        beforeEach(async function() {
            VotingInstance = await Voting.new({from:owner});
            await VotingInstance.addVoter(owner, {from:owner});
            await VotingInstance.startProposalsRegistering({from:owner});
            await VotingInstance.addProposal('Jojo est le meilleur manga', {from:owner});
            await VotingInstance.endProposalsRegistering({from:owner});
        })
        it("...verify proposal Id", async () => {
            await VotingInstance.startVotingSession({from:owner});
            await VotingInstance.setVote(0, {from:owner}); // utiliser une fonction
            const storedData = await VotingInstance.getVoter(owner, {from:owner});
            expect(new BN(storedData.votedProposalId)).to.be.bignumber.equal(new BN(0));
        })
        it("...verify hasVoted is true", async () => {
            await VotingInstance.startVotingSession({from:owner});
            await VotingInstance.setVote(0, {from:owner}); // utiliser une fonction
            const storedData = await VotingInstance.getVoter(owner, {from:owner});
            expect(storedData.hasVoted).to.equal(true);
        })
        it("...verify voteCount++", async () => {
            await VotingInstance.startVotingSession({from:owner});
            await VotingInstance.setVote(0, {from:owner}); // utiliser une fonction
            const storedData = await VotingInstance.getOneProposal(0, {from:owner});
            expect(new BN(storedData.voteCount)).to.be.bignumber.equal(new BN(1));
        })
        it("...should not be able to vote", async () => {   
            await expectRevert(VotingInstance.setVote(0, {from:owner}), 'Voting session havent started yet')
        })
        it("...cannot vote 2 times", async () => {
            await VotingInstance.startVotingSession({from:owner});
            await VotingInstance.setVote(0, {from:owner});
            await expectRevert(VotingInstance.setVote(0, {from:owner}), 'You have already voted')
        })
        it("...cannot vote 2 times", async () => {
            await VotingInstance.startVotingSession({from:owner});
            await expectRevert(VotingInstance.setVote(1, {from:owner}), 'Proposal not found')// avec require(_id <= proposalsArray.length-1, 'Proposal not found');
        })
    })
    describe('tallyVotes', () => {
        beforeEach(async function () {
            // await VotingInstance.transferOwnership(owner, {from:owner});
            VotingInstance = await Voting.new({from:owner});
            await VotingInstance.addVoter(owner, {from:owner});
            await VotingInstance.addVoter(second, {from:owner});
            await VotingInstance.addVoter(third, {from:owner});
            await VotingInstance.startProposalsRegistering({from:owner});
            await VotingInstance.addProposal('Jojo est le meilleur manga', {from:owner});
            await VotingInstance.addProposal('Tokyo Ghoul est le meilleur manga', {from:owner});
            await VotingInstance.endProposalsRegistering({from:owner});
            await VotingInstance.startVotingSession({from:owner});
        })
        it("...verify winningProposal", async () => {
            await VotingInstance.setVote(0, {from:owner});
            await VotingInstance.setVote(1, {from:second});
            await VotingInstance.setVote(0, {from:third});
            await VotingInstance.endVotingSession({from:owner});
            await VotingInstance.tallyVotes({from:owner});           
            const storedData = await VotingInstance.winningProposalID.call();
            expect(new BN(storedData)).to.be.bignumber.equal(new BN(0));
        })
        it("...should not be able to tally", async () => {
            await expectRevert(VotingInstance.tallyVotes({from:owner}), 'Current status is not voting session ended')
        })
    })
    describe('tests des event, du require des enum', () => {
        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner});           
        })
        it('switch to ProposalsRegistrationStarted', async () => {
            await VotingInstance.startProposalsRegistering({from:owner});
            const storedData = await VotingInstance.workflowStatus.call();
            expect(new BN(storedData)).to.be.bignumber.equal(new BN(1));
        })
        it('should not switch to ProposalsRegistrationStarted', async () => {
            await VotingInstance.startProposalsRegistering({from:owner});
            await VotingInstance.endProposalsRegistering({from:owner});
            await expectRevert(VotingInstance.startProposalsRegistering({from:owner}), 'Registering proposals cant be started now')
        })
        it('switch to endProposalsRegistering', async () => {
            await VotingInstance.startProposalsRegistering({from:owner});
            await VotingInstance.endProposalsRegistering({from:owner});
            const storedData = await VotingInstance.workflowStatus.call();
            expect(new BN(storedData)).to.be.bignumber.equal(new BN(2));
        })
        it('should not switch to endProposalsRegistering', async () => {
            await expectRevert(VotingInstance.endProposalsRegistering({from:owner}), 'Registering proposals havent started yet')
        })
        it('switch to startVotingSession', async () => {
            await VotingInstance.startProposalsRegistering({from:owner});
            await VotingInstance.endProposalsRegistering({from:owner});
            await VotingInstance.startVotingSession({from:owner});
            const storedData = await VotingInstance.workflowStatus.call();
            expect(new BN(storedData)).to.be.bignumber.equal(new BN(3));
        })
        it('should not switch to startVotingSession', async () => {
            await expectRevert(VotingInstance.startVotingSession({from:owner}), 'Registering proposals phase is not finished')
        })
        it('switch to endVotingSession', async () => {
            await VotingInstance.startProposalsRegistering({from:owner});
            await VotingInstance.endProposalsRegistering({from:owner});
            await VotingInstance.startVotingSession({from:owner});
            await VotingInstance.endVotingSession({from:owner});
            const storedData = await VotingInstance.workflowStatus.call();
            expect(new BN(storedData)).to.be.bignumber.equal(new BN(4));
        })
        it('should not switch to endVotingSession', async () => {
            await expectRevert(VotingInstance.endVotingSession({from:owner}), 'Voting session havent started yet')
        })
            
    })
    describe('Event triggering', () => {
        
    })
})
