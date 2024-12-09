const { SlashCommandBuilder } = require('discord.js');
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
        addGame(interaction.options.getString('game'));
        await interaction.reply(`Adding ${interaction.options.getString('game')} to the list of games.
        The current list of games is: ${getGames()}`);
    },
};