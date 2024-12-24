const { ButtonInteraction } = require('discord.js');
const { getChannelId, getLosingTribe, setGameState, gameStates,getTribes, setTribes, getPlayers, setPlayers, getJury, setJury } = require("../../gameState");
const {generateChallengeMessage} = require("../../utility");
const { mergeNumber, jurySize} = require("../../constants");

let votes = [];

async function removePlayerAndAddToJury(playerId, interaction, gameChannel) {
    let tribes = getTribes();
    let players = getPlayers();
    let jury = getJury();
    if(tribes.length>1) {
        // Remove player from tribes
        tribes = tribes.map(tribe => {
            tribe.players = tribe.players.filter(player => player.id !== playerId);
            return tribe;
        });
    }

    // Add player to jury if jury size is less than 10
    console.log(`jury size: ${jury.length} jurySize: ${jurySize} players length: ${players.length} mergeNumber: ${mergeNumber}`);
    if (jury.length < jurySize && players.length < mergeNumber) {
        console.log(`adding player to jury playerId: ${playerId}`);
        const player = players.find(player => player.id === playerId);
        if (player) {
            jury.push(player);
        }
    }

    // Remove player from players array
    players = players.filter(player => player.id !== playerId);
    setPlayers(players);

    // Update the state
    setTribes(tribes);
    if(players.length <12) {
        setTribes({name: 'mergedTribe', players: getPlayers()});
        // Announce the result
        await gameChannel.send(`The tribes have been merged and you compete for individual immunity going forward!`);

    }
    setPlayers(players);
    setJury(jury);
}

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        const tribe = getLosingTribe();
        const playerId = interaction.user.id;
        const votedForId = interaction.customId.split('_')[1];
        console.log(`voted for ${votedForId}`);
        // Record the vote
        votes.push(votedForId);
        console.log(tribe);
        await interaction.reply(`You voted for ${tribe.players.find(p => p.id === votedForId).playerName}.`);

        // Check if all players have voted commented out for now for testing
        //if (Object.keys(votes).length === tribe.players.length) {
           await tallyVotes(interaction);
        //}
    },
};

async function tallyVotes(interaction) {
    const tribe = getLosingTribe();
    const voteCounts = {};

    // Count votes
    for (const vote of Object.values(votes)) {
        voteCounts[vote] = (voteCounts[vote] || 0) + 1;
    }

    // Find the player with the most votes
    const votedOutId = Object.keys(voteCounts).reduce((a, b) => voteCounts[a] > voteCounts[b] ? a : b);
    const votedOutPlayer = tribe.players.find(p => p.id === votedOutId);
    const gameChannel = await interaction.client.channels.fetch(getChannelId());

    if(getPlayers().length<=3) {
        await gameChannel.send(`${votedOutPlayer.playerName} has won!`);
        setGameState(gameStates.starting);
        return;
    }
    await removePlayerAndAddToJury(votedOutId, interaction,gameChannel);

    // Announce the result
    await gameChannel.send(`${votedOutPlayer.playerName} has been voted out!`);
    let message = await generateChallengeMessage();
    if(getTribes().length>1) {
        await gameChannel.send(message);
    } else {
        for (const actionRow of message) {
            await gameChannel.send({
                components: [actionRow]
            });
        }
    }
    votes = [];
    // Update game state
    setGameState(gameStates.playing);
}