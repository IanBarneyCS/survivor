const { getPlayers, getGameState, gameStates } = require('../../gameState.js');
const {getGames, setCurrentGame, setGameState, getPlayerNames, getTribes, getCurrentGame, setTribePlayers} = require("../../gameState");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const {generateChallengeMessage, splitPlayersRandomly} = require("../../utility");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'ready_button') return;

        if((getGameState() === gameStates.askingForGames || getGameState() === gameStates.playing)
            && getGames().length > 0) {
            splitPlayersRandomly(getPlayers());
            let message = await generateChallengeMessage();
            await interaction.reply(message);
            return;
        }
        if(getGameState() !== gameStates.waitingForJoiners) {
            await interaction.reply('Either a game is already in progress or you have not started a game yet.');
            return;
        }
        setGameState(gameStates.askingForGames);
        await interaction.reply('Please type /add ' +
            'and the name of the game want to add to the list of games. Example: "/add Halo". ' +
            'Use /ready again to start the game.');
    },
};