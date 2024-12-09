const { getTribes, setGameState, gameStates } = require('../../gameState.js');
const {ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const {setLosingTribe} = require("../../gameState");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const tribes = getTribes();
        let losingTribe;

        if (interaction.customId === 'tribe1_winner') {
            losingTribe = tribes[1];
        } else if (interaction.customId === 'tribe2_winner') {
            losingTribe = tribes[0];
        } else {
            return;
        }
        setLosingTribe(losingTribe);
        setGameState(gameStates.voting);
        await interaction.reply(`The losing tribe is ${losingTribe.name}. Members of the losing tribe will receive a DM to vote.`);

        // Create a button for each player
        const buttons = losingTribe.players.map(player =>
            new ButtonBuilder()
                .setCustomId(`vote_${player.id}`)
                .setLabel(`${player.playerName}`)
                .setStyle(ButtonStyle.Primary)
        );

        // Create an action row for the buttons
        const actionRow = new ActionRowBuilder().addComponents(buttons);

        // Send the buttons to each player
        for (const player of losingTribe.players) {
            const user = await interaction.client.users.fetch(player.id);
            await user.send({
                content: `Hello ${player.playerName}, please cast your vote:`,
                components: [actionRow]
            });
        }
    },
};