const { ButtonInteraction } = require('discord.js');
const { getChannelId, getLosingTribe, setGameState, gameStates,getTribes, setTribes, getPlayers, setPlayers, getJury, setJury } = require("../../gameState");
const {generateChallengeMessage} = require("../../utility");

let votes = [];

async function removePlayerAndAddToJury(playerId, interaction, gameChannel) {
    let tribes = getTribes();
    let players = getPlayers();
    let jury = getJury();

    // Remove player from tribes
    tribes = tribes.map(tribe => {
        tribe.players = tribe.players.filter(player => player.id !== playerId);
        return tribe;
    });

    // Remove player from players array
    players = players.filter(player => player.id !== playerId);
    setPlayers(players);

    // Add player to jury if jury size is less than 10
    if (jury.length < 10) {
        const player = players.find(player => player.id === playerId);
        if (player) {
            jury.push(player);
        }
    }

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