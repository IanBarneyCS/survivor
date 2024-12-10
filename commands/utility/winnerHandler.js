const { getTribes, setGameState, gameStates } = require('../../gameState.js');
const {ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const {setLosingTribe, getPlayers} = require("../../gameState");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        let losingTribe = getTribes()[0];
        const tribes = getTribes();
        let winner;
        if (tribes.length > 1) {
            if (interaction.customId === 'tribe1_winner') {
                losingTribe = tribes[1];
            } else if (interaction.customId === 'tribe2_winner') {
                losingTribe = tribes[0];
            } else {
                return;
            }
        } else {
            let winnerId = interaction.customId.split('_')[1];
            console.log(`winnerId: ${winnerId}`);
            winner = getPlayers().find(p => p.id === winnerId);
        }
        setLosingTribe(losingTribe);
        setGameState(gameStates.voting);
        let playersToVote = losingTribe;
        if (tribes.length > 1) {
            await interaction.reply(`The losing tribe is ${losingTribe.name}. Members of the losing tribe will receive a DM to vote.`);
        } else {
            playersToVote = getPlayers();
            await interaction.reply(`The winner is ${winner.playerName}. Everyone else will receive a DM to vote.`);
        }
        // Create a button for each player
        const buttons = playersToVote.players.map(player => {
            if(!winner || (winner && player.id !== winner.id)) {
                return new ButtonBuilder()
                    .setCustomId(`vote_${player.id}`)
                    .setLabel(`${player.playerName}`)
                    .setStyle(ButtonStyle.Primary);
            }
        });

        // Create an action row for the buttons
        const actionRows = [];
        for (let i = 0; i < buttons.length; i += 5) {
            actionRows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
        }
        // Send the buttons to each player
        for (const player of playersToVote.players) {
            if (player.id === '281823908083269633') {
                const user = await interaction.client.users.fetch(player.id);
                await user.send({
                    content: `Hello ${player.playerName}, please cast your vote:`
                });
                for (const actionRow of actionRows) {
                    await user.send({
                        components: [actionRow]
                    });
                }
            }
        }
    },
};