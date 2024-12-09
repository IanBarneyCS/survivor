const { SlashCommandBuilder } = require('discord.js');
const { gameStates, getGameState, setGameState, getGames, setCurrentGame, getCurrentGame, setTribePlayers } = require('../../gameState.js');
const {getPlayers, getTribes, getPlayerNames} = require("../../gameState");

function getRandomItem(arr) {
    // Get a random index value
    const randomIndex = Math.floor(Math.random() * arr.length);
    // Get the random item
    const item = arr[randomIndex];
    return item;
}

function splitPlayersRandomly(arr) {
    // Shuffle the array
    const shuffled = arr.sort(() => 0.5 - Math.random());
    // Calculate the middle index
    const middleIndex = Math.ceil(shuffled.length / 2);
    // Split the array into two parts
    const firstHalf = shuffled.slice(0, middleIndex);
    const secondHalf = shuffled.slice(middleIndex);
    setTribePlayers(firstHalf, secondHalf);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ready')
        .setDescription('readys up the lobby'),
    async execute(interaction) {
        if((getGameState() === gameStates.askingForGames || getGameState() === gameStates.playing)
            && getGames().length > 0) {
            setCurrentGame(getRandomItem(getGames()));
            setGameState(gameStates.playing);
            splitPlayersRandomly(getPlayers());
            await interaction.reply(`The tribes will be ${getPlayerNames(getTribes()[0])} against ${getPlayerNames(getTribes()[1])} 
            Your game for this challenge will be ${getCurrentGame()}` );
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