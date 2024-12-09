const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const { gameStates, getGameState, getGames, addGame } = require('../../gameState.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('adds a game to the list of games')
        .addStringOption(option =>
            option.setName('game')
                .setDescription('The game they want to add')),
    async execute(interaction) {
        if(getGameState() === gameStates.starting) {
            await interaction.reply('Start a game first.');
            return;
        }
        const readyButton = new ButtonBuilder()
            .setCustomId('ready_button')
            .setLabel('Ready')
            .setStyle(ButtonStyle.Success);
        const actionRow = new ActionRowBuilder().addComponents(readyButton);

        addGame(interaction.options.getString('game'));
        await interaction.reply({
            content: `Adding ${interaction.options.getString('game')} to the list of games.
        The current list of games is: ${getGames()}`,
            components: [actionRow]
        });
    },
};