const { getPlayers, addPlayer, getGameState, getAllNames, gameStates } = require('../../gameState.js');
const {ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'join_button') return;

        if (getGameState() !== gameStates.waitingForJoiners) {
            await interaction.reply('A game is already in progress or you have not started a game yet.');
            return;
        }

        if (getPlayers().some(player => player.id === interaction.user.id)) {
            await interaction.reply(`${interaction.user.username}, you are already in the game!`);
            return;
        }
        const joinButton = new ButtonBuilder()
            .setCustomId('join_button')
            .setLabel('Join the Game')
            .setStyle(ButtonStyle.Primary);

        const readyButton = new ButtonBuilder()
            .setCustomId('ready_button')
            .setLabel('Ready')
            .setStyle(ButtonStyle.Success);

        const actionRow = new ActionRowBuilder().addComponents(joinButton, readyButton);

        addPlayer(interaction.user.id, interaction.user.username);
        await interaction.reply({
            content: `${interaction.user.username} has joined the game! ${getAllNames().join(', ')} players have joined.\
                    The game is starting! Click the button to join the game. Once everyone is and you added the games you want to play click the ready button.`,
            components: [actionRow]
        });
    },
};