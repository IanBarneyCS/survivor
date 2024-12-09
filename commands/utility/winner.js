const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const { gameStates, getGameState, setGameState } = require('../../gameState.js');
const {setLosingTribe, getPlayerTribe, getLosingTribe} = require("../../gameState");

let votes = [];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loser')
        .setDescription('tells the game who lost'),
    async execute(interaction) {
        if(getGameState() !== gameStates.playing) {
            await interaction.reply(`looks like there is no active challenge going on right now.`);
            return;
        }
        setLosingTribe(getPlayerTribe(interaction.user.id));
        setGameState(gameStates.tribal);
        const tribe = getLosingTribe();
        votes = {}; // Reset votes

        // Create a button for each player
        const buttons = tribe.players.map(player =>
            new ButtonBuilder()
                .setCustomId(`vote_${player.id}`)
                .setLabel(`Vote for ${player.playerName}`)
                .setStyle(ButtonStyle.Primary)
        );

        // Create an action row for the buttons
        const actionRow = new ActionRowBuilder().addComponents(buttons);

        // Send the buttons to each player
        for (const player of tribe.players) {
            const user = await interaction.client.users.fetch(player.id);
            await user.send({
                content: `Hello ${player.playerName}, please cast your vote:`,
                components: [actionRow]
            });
        }

        await interaction.reply('Voting has started. Buttons have been sent to all players in the tribe.');
       },
};