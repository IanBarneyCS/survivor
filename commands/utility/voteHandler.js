const { ButtonInteraction } = require('discord.js');
const { getLosingTribe, setGameState, gameStates,getTribes, setTribes, getPlayers, setPlayers, getJury, setJury } = require("../../gameState");

let votes = [];

function removePlayerAndAddToJury(playerId) {
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

    // Add player to jury if jury size is less than 10
    if (jury.length < 10) {
        const player = players.find(player => player.id === playerId);
        if (player) {
            jury.push(player);
        }
    }

    // Update the state
    setTribes(tribes);
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

        // Record the vote
        votes.push(votedForId);

        await interaction.reply(`You voted for ${tribe.players.find(p => p.id === votedForId).playerName}.`);

        // Check if all players have voted
        if (Object.keys(votes).length === tribe.players.length) {
            tallyVotes(interaction);
        }
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
    removePlayerAndAddToJury(votedOutId);
    // Announce the result
    await interaction.channel.send(`${votedOutPlayer.playerName} has been voted out!`);

    // Update game state
    setGameState(gameStates.playing);
}