const { SlashCommandBuilder } = require('discord.js');
const {getLosingTribe} = require("../../gameState");
const {ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {

        // Create a button for each player
        const buttons = getLosingTribe().players.map(player =>
            new ButtonBuilder()
                .setCustomId(`button_${player.id}`)
                .setLabel(`Button for ${player.playerName}`)
                .setStyle(ButtonStyle.Primary)
        );

        // Create an action row for the buttons
        const actionRow = new ActionRowBuilder().addComponents(buttons);

        // Send the buttons to each player
        for (const player of getLosingTribe().players) {
            const user = await interaction.client.users.fetch(player.player);
            await user.send({
                content: `Hello ${player.playerName}, here is your button:`,
                components: [actionRow]
            });
        }

        await interaction.reply('Buttons have been sent to all players in the tribe.');
    },
};