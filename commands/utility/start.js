const { SlashCommandBuilder } = require('discord.js');
const { gameStates, getGameState, setGameState } = require('../../gameState.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('starts a game of survivor'),
    async execute(interaction) {
        if(getGameState() !== gameStates.starting) {
            await interaction.reply('A game is already in progress.');
            return;
        }
        setGameState(gameStates.waitingForJoiners);
        await interaction.reply('Welcome to Survivor! Everyone who would like to play, please type /join.' +
            ' Once everyone has joined, type /ready to begin the game.');
    },
};