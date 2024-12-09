const { getPlayers, getGameState, gameStates } = require('../../gameState.js');
const {getGames, setCurrentGame, setGameState, getPlayerNames, getTribes, getCurrentGame, setTribePlayers} = require("../../gameState");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

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
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'ready_button') return;

        if((getGameState() === gameStates.askingForGames || getGameState() === gameStates.playing)
            && getGames().length > 0) {
            setCurrentGame(getRandomItem(getGames()));
            setGameState(gameStates.playing);
            splitPlayersRandomly(getPlayers());

            const tribes = getTribes();
            const tribe1Button = new ButtonBuilder()
                .setCustomId('tribe1_winner')
                .setLabel(`Tribe 1`)
                .setStyle(ButtonStyle.Primary);

            const tribe2Button = new ButtonBuilder()
                .setCustomId('tribe2_winner')
                .setLabel(`Tribe 2`)
                .setStyle(ButtonStyle.Primary);

            const actionRow = new ActionRowBuilder().addComponents(tribe1Button, tribe2Button);

            await interaction.reply({
                content: `The tribes will be ${getPlayerNames(tribes[0])} against ${getPlayerNames(tribes[1])}. Your game for this challenge will be ${getCurrentGame()}. Click the button for the winning tribe.`,
                components: [actionRow]
            });
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