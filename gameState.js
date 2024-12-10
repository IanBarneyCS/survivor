const gameStates = {
  starting: 'starting',
  waitingForJoiners: 'waitingForJoiners',
  askingForGames: 'askingForGames',
  playing: 'playing',
  tribal: 'tribal'
};
let channelId = '';
let gameState = gameStates.starting;
let players = [
    {id:'1', playerName: 'jim'},
  {id:'2', playerName: 'jane'},
  {id:'3', playerName: 'joe'},
  {id:'4', playerName: 'jill'},
  {id:'5', playerName: 'jack'},
  {id:'6', playerName: 'jenny'},
  {id:'7', playerName: 'jacob'},
  {id:'8', playerName: 'jessica'},
  {id:'9', playerName: 'jason'},
  {id:'10', playerName: 'julie'},
  {id:'11', playerName: 'josh'},
  {id:'12', playerName: 'julian'},
];
let games = [];
let currentGame = '';
let losingTribe = '';
let tribe1 = {
  name: 'Tribe 1',
  players: []
};
let tribe2 = {
  name: 'Tribe 2',
  players: []
};
let jury = [];
let tribes = [tribe1, tribe2];

function setTribePlayers(players1, players2) {
    tribe1.players = players1;
    tribe2.players = players2;
}

function getTribes() {
  return tribes;
}

function setCurrentGame(game) {
  currentGame = game;
}
function setChannelId(id) {
    channelId = id;
}
function getChannelId() {
    return channelId;
}
function getCurrentGame() {
  return currentGame;
}

function setGameState(newState) {
  gameState = newState;
}

function getGameState() {
  return gameState;
}

function addPlayer(id, playerName) {
  players.push({id, playerName});
}

function getPlayers() {
  return players;
}

function addGame(game) {
  games.push(game);
}

function getGames() {
  return games;
}

function getPlayerNames(tribe) {
  return tribe.players.map(player => player.playerName);
}

function getAllNames() {
  return players.map(player => player.playerName);
}

function setLosingTribe(tribe) {
  losingTribe = tribe;
}

function getLosingTribe() {
  return losingTribe;
}
function getPlayerTribe(player) {
  const tribes = getTribes();
  for (const tribe of tribes) {
    if (tribe.players.some(p => p.id === player)) {
      return tribe;
    }
  }
  return null; // Return null if the player is not found in any tribe
}
function setPlayers(newPlayers) {
  players = newPlayers;
}
function setTribes(newTribes) {
  tribes = newTribes;
}
function setJury(newJury) {
  jury = newJury;
}
function getJury() {
    return jury;
}

export {getChannelId, setChannelId, getPlayerTribe, getLosingTribe, setLosingTribe, getGameState, getPlayerNames, getAllNames, gameStates, setGameState, addPlayer, addGame, getPlayers, getGames, getCurrentGame, setCurrentGame, setTribePlayers, getTribes, setTribes, setPlayers, getJury, setJury };