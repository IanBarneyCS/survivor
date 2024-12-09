const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const {getLosingTribe} = require("../../gameState");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Sends a button to each player in the given tribe.'),
    async execute(interaction) {
        // Example tribe object
        const tribe = getLosingTribe();

        // Create a button for each player
        const buttons = tribe.players.map(player =>
            new ButtonBuilder()
                .setCustomId(`button_${player.id}`)
                .setLabel(`Button for ${player.playerName}`)
                .setStyle(ButtonStyle.Primary)
        );

        // Create an action row for the buttons
        const actionRow = new ActionRowBuilder().addComponents(buttons);

        // Send the buttons to each player
        for (const player of tribe.players) {
            const user = await interaction.client.users.fetch(player.id);
            await user.send({
                content: `Hello ${player.playerName}, here is your button:`,
                components: [actionRow]
            });
        }

        await interaction.reply('Buttons have been sent to all players in the tribe.');
    },
};