const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { gameStates, setGameState, getGameState } = require('../../gameState.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Starts the game and sends join and ready buttons to the channel.'),
    async execute(interaction) {
        if (getGameState() !== gameStates.starting) {
            await interaction.reply('A game is already in progress or you have not started a game yet.');
            return;
        }

        setGameState(gameStates.waitingForJoiners);

        const joinButton = new ButtonBuilder()
            .setCustomId('join_button')
            .setLabel('Join the Game')
            .setStyle(ButtonStyle.Primary);

        const readyButton = new ButtonBuilder()
            .setCustomId('ready_button')
            .setLabel('Ready')
            .setStyle(ButtonStyle.Success);
        const actionRow = new ActionRowBuilder().addComponents(joinButton, readyButton);

        await interaction.reply({
            content: 'The game is starting! Click the buttons to join the game, mark yourself as ready, or add a game.',
            components: [actionRow]
        });
    },
};