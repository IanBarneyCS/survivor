const {
    setTribePlayers,
    setCurrentGame,
    getGames,
    setGameState,
    gameStates,
    getPlayers,
    getTribes,
    getPlayerNames,
    getCurrentGame
} = require('./gameState');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

async function generateChallengeMessage() {
    setCurrentGame(getRandomItem(getGames()));
    setGameState(gameStates.playing);

    const tribes = getTribes();
    if(tribes.length>1) {
        const tribe1Button = new ButtonBuilder()
            .setCustomId('tribe1_winner')
            .setLabel(`Tribe 1`)
            .setStyle(ButtonStyle.Primary);

        const tribe2Button = new ButtonBuilder()
            .setCustomId('tribe2_winner')
            .setLabel(`Tribe 2`)
            .setStyle(ButtonStyle.Primary);
        const actionRow = new ActionRowBuilder().addComponents(tribe1Button, tribe2Button);

        return {
            content: `The tribes are ${getPlayerNames(tribes[0])} against ${getPlayerNames(tribes[1])}. Your game for this challenge will be ${getCurrentGame()}. Click the button for the winning tribe.`,
            components: [actionRow]
        };
    } else {
        // Create a button for each player
        const buttons = getPlayers().map(player =>
            new ButtonBuilder()
                .setCustomId(`tribe1_${player.id}`)
                .setLabel(`${player.playerName}`)
                .setStyle(ButtonStyle.Primary)
        );

        // Create an action row for the buttons
        const actionRows = [];
        for (let i = 0; i < buttons.length; i += 5) {
            actionRows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
        }
        return actionRows;
    }


}

function getRandomItem(arr) {
    // Get a random index value
    const randomIndex = Math.floor(Math.random() * arr.length);
    // Get the random item
    return arr[randomIndex];
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

module.exports = { generateChallengeMessage, getRandomItem, splitPlayersRandomly };