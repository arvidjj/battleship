import { createGameboard } from './classes/Gameboard'
import { createPlayer } from './classes/Player'

const humanGameboard = createGameboard();
const aiGameboard = createGameboard();

const humanPlayer = createPlayer();
const aiPlayer = createPlayer();


//TESTING
humanPlayer.takeTurn(aiGameboard, 2, 3);
aiPlayer.takeRandomTurn(humanGameboard); 
