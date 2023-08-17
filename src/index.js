import { createGameboard } from './classes/Gameboard';
import { createPlayer } from './classes/Player';
import { createShip } from './classes/Ship';
import "./style.css";

const playerGameboard = createGameboard();
const enemyGameboard = createGameboard();

//renders one board based on getCellContent on gameboard class
function renderBoard(board, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear
    for (let y = 0; y < board.getSize(); y++) {
        for (let x = 0; x < board.getSize(); x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = board.getCellContent(x, y);
            cell.dataset.x = x;
            cell.dataset.y = y;
            container.appendChild(cell);
        }
    }
}

const player = createPlayer();
const enemy = createPlayer();

const playerBoardContainer = 'player-board';
const enemyBoardContainer = 'enemy-board';

//For now hardcoding creating the ships to test
const shipA = createShip(0, 3);
const shipB = createShip(1, 4);
const shipC = createShip(2, 5);
const shipD = createShip(3, 6);

//Placing ships in each board
playerGameboard.placeShip(shipA, 0, 0, true);
playerGameboard.placeShip(shipB, 5, 5, false);
enemyGameboard.placeShip(shipC, 4, 6, true);
enemyGameboard.placeShip(shipD, 2, 3, false);


renderBoard(playerGameboard, playerBoardContainer);
renderBoard(enemyGameboard, enemyBoardContainer);

//for the clicks (player turn)
document.getElementById(enemyBoardContainer).addEventListener('click', (event) => {
    if (event.target.classList.contains('cell')) {
        const x = event.target.dataset.x;
        const y = event.target.dataset.y;

        if (x !== undefined && y !== undefined) {
            const isSuccessfulHit = player.takeTurn(enemyGameboard, parseInt(x), parseInt(y));

            if (isSuccessfulHit) {
                event.target.textContent = 'H';
            } else {
                event.target.textContent = 'X';
            }

            //game over conditions here
            if (enemyGameboard.allShipsSunk()) {
                console.log("YOU WUN")
            }
            //computer take its turn
            computerTurn();
        }
    }
});


//Computer turn
function computerTurn() {
    let randomX, randomY;

    do {
        //RANDOM coordinates for ocomputer
        
        randomX = Math.floor(Math.random() * playerGameboard.getSize());
        randomY = Math.floor(Math.random() * playerGameboard.getSize());
        console.log(playerGameboard.getCellContent(randomX, randomY))
    } while (
        playerGameboard.getCellContent(randomX, randomY) === 'X' ||
        playerGameboard.getCellContent(randomX, randomY) === 'H' ||
        playerGameboard.getCellContent(randomX, randomY) === 'S'
    );

    const isSuccessfulHit = enemy.takeTurn(playerGameboard, randomX, randomY);
    const playerBoardCell = document.querySelector(`#${playerBoardContainer} [data-x="${randomX}"][data-y="${randomY}"]`);

    if (isSuccessfulHit) {
        if (playerGameboard.getCellContent(randomX, randomY) === 'O') {
            playerBoardCell.textContent = 'H';
        }
    } else {
        playerBoardCell.textContent = 'X';
    }

    if (playerGameboard.allShipsSunk()) {
        console.log("COMPUTER WINS");
    }
}