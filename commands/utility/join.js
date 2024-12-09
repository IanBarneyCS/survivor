const { SlashCommandBuilder } = require('discord.js');
const { getPlayers, addPlayer } = require('../../gameState.js');
const {getGameState, getAllNames } = require("../../gameState");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('adds you to the game'),
    async execute(interaction) {
        if(getGameState()!=='waitingForJoiners') {
            await interaction.reply('A game is already in progress or you have not started a game yet.');
            return;
        }
        if(getPlayers().includes(interaction.user.id)) {
            await interaction.reply(`${interaction.user.username} You are already in the game!`);
            return;
        }
        await addPlayer(interaction.user.id, interaction.user.username);
        await interaction.reply(`${interaction.user.username} has joined the game! ${getAllNames()} players have joined.`);
    },
};