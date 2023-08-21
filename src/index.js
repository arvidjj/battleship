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
let shipIdCounter = 1;

renderBoard(playerGameboard, playerBoardContainer);
renderBoard(enemyGameboard, enemyBoardContainer);

const selectShipButton = document.getElementById('select-ship');
const shipLengthInput = document.getElementById('ship-length');
const startGameButton = document.getElementById('start-game');
const toggleOrientationButton = document.getElementById('toggle-orientation');
const maxPowerNav = document.getElementById('max-power');

//ship placement
const totalShips = 6; //max ships (unused now)
let selectedShip = null;
let isShipHorizontal = true;
const maxShipLength = 5;
const maxShipTotalLength = 20; //max cells of ships
maxPowerNav.textContent = maxShipTotalLength;

const playerBoard = document.getElementById(playerBoardContainer)

//Hide the start button in the start
startGameButton.disabled = true;

playerBoard.addEventListener('click', handleShipPlacement);

// handle ship placement by the user
function handleShipPlacement(event) {
    if (event.target.classList.contains('cell')) {
        const x = parseInt(event.target.dataset.x);
        const y = parseInt(event.target.dataset.y);

        if (playerGameboard.isValidMove(x, y) && selectedShip) {
            const shipFits = playerGameboard.canPlaceShip(selectedShip, x, y, isShipHorizontal);

            if (shipFits) {
                playerGameboard.placeShip(selectedShip, x, y, isShipHorizontal);
                renderBoard(playerGameboard, playerBoardContainer);
                selectedShip = null;
                isShipHorizontal = true;

                selectShipButton.disabled = false;
                selectShipButton.textContent = 'Select Ship'

                console.log("Ship quantity: " + playerGameboard.getShipQuantity())

                //Check if all ships have been placed
                console.log("total " + playerGameboard.getShipTotalLength())

                maxPowerNav.textContent = maxShipTotalLength - playerGameboard.getShipTotalLength();

                if (playerGameboard.getShipTotalLength() >= maxShipTotalLength) {
                    selectShipButton.disabled = true;
                    playerBoard.removeEventListener('click', handleShipPlacement);
                    startGameButton.disabled = false;
                }
            } else {
                console.log("Selected ship doesn't fit here");
            }
        }
    }
}




//handle ship selection by the user
function selectShip(length) {
    const shipId = shipIdCounter++;
    selectedShip = createShip(shipId, length);
}

selectShipButton.addEventListener('click', () => {
    const selectedLength = parseInt(shipLengthInput.value);
    if (!isNaN(selectedLength) && selectedLength >= 2 && selectedLength <= maxShipLength) {
        selectShip(selectedLength);
        selectShipButton.disabled = true;
        selectShipButton.textContent = 'Click on the cell'
    }
});
//toggle ship orientation
function toggleShipOrientation() {
    isShipHorizontal = !isShipHorizontal;
    if (isShipHorizontal === true) {
        toggleOrientationButton.textContent = 'Horizontal'

    } else {
        toggleOrientationButton.textContent = 'Vertical'
    }
}


toggleOrientationButton.addEventListener('click', toggleShipOrientation);

const placedCoordinates = new Set(); //To store already placed coordinates
placeRandomShips(enemyGameboard);
renderBoard(enemyGameboard, enemyBoardContainer);

function placeRandomShips(gameboard) {
    while (gameboard.getShipTotalLength() + 2 <= maxShipTotalLength) { //ships with length 1 cant be placed, thats why + 2 is needed
        const shipLength = Math.floor(Math.random() * (maxShipLength - 1)) + 2;
        const isHorizontal = Math.random() < 0.5;

        //Calculate random coordinates considering ship length and orientation
        let randomX, randomY;
        if (isHorizontal) {
            randomX = Math.floor(Math.random() * (gameboard.getSize() - shipLength + 1));
            randomY = Math.floor(Math.random() * gameboard.getSize());
        } else {
            randomX = Math.floor(Math.random() * gameboard.getSize());
            randomY = Math.floor(Math.random() * (gameboard.getSize() - shipLength + 1));
        }

        //Check if the coordinates have already been used
        const coordinatesKey = `${randomX},${randomY},${isHorizontal}`;
        if (!placedCoordinates.has(coordinatesKey)) {
            const newShip = createShip(shipIdCounter++, shipLength);
            if (gameboard.placeShip(newShip, randomX, randomY, isHorizontal)) {
                //Add the coordinates to the placedCoordinates set
                for (let i = 0; i < newShip.getLength(); i++) {
                    const x = isHorizontal ? randomX + i : randomX;
                    const y = isHorizontal ? randomY : randomY + i;
                    placedCoordinates.add(`${x},${y},${isHorizontal}`);
                }
            }
        }
    }

    // After all ships are placed, render the board
    renderBoard(gameboard, enemyBoardContainer);
}


// Computer turn
function computerTurn() {
    updateGameStatus("Opponent's turn");
    setTimeout(() => {
        let randomX, randomY;

        do {
            // RANDOM coordinates for computer
            randomX = Math.floor(Math.random() * playerGameboard.getSize());
            randomY = Math.floor(Math.random() * playerGameboard.getSize());
        } while (
            playerGameboard.getCellContent(randomX, randomY) === 'X' ||
            playerGameboard.getCellContent(randomX, randomY) === 'H' ||
            playerGameboard.getCellContent(randomX, randomY) === 'S'
        );

        const isSuccessfulHit = enemy.takeTurn(playerGameboard, randomX, randomY);
        const playerBoardCell = document.querySelector(`#${playerBoardContainer} [data-x="${randomX}"][data-y="${randomY}"]`);

        if (isSuccessfulHit) {
            if (playerGameboard.getCellContent(randomX, randomY) === 'O') {
                playerGameboard.receiveAttack(randomX, randomY); // Update hits array for the player's gameboard
                playerBoardCell.textContent = 'H';
            }
        } else {
            playerBoardCell.textContent = 'X';
        }

        // Check if computer wins
        if (playerGameboard.allShipsSunk()) {
            updateGameStatus("Computer wins!");
            return;
        } else {
            updateGameStatus("Your turn");
            isPlayerTurn = true;
            handlePlayerTurn(); // Start player turn
        }
    }, 1000); // Delay for computer move
}

let isPlayerTurn = false;
let gameStarted = false;

startGameButton.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        isPlayerTurn = true; //Player starts
        updateGameStatus("Your turn");
        startGameButton.disabled = true;

        handlePlayerTurn(); //Start player turn
    }
});

//handle player turn
function handlePlayerTurn() {
    if (isPlayerTurn) {
        document.getElementById(enemyBoardContainer).addEventListener('click', handlePlayerShot);
    }
}


//for the clicks (player turn)
function handlePlayerShot(event) {

    if (isPlayerTurn && event.target.classList.contains('cell')) {
        const x = event.target.dataset.x;
        const y = event.target.dataset.y;

        if (x !== undefined && y !== undefined) {
            const isSuccessfulHit = player.takeTurn(enemyGameboard, parseInt(x), parseInt(y));

            if (isSuccessfulHit) {
                event.target.textContent = 'H';
            } else {
                event.target.textContent = 'X';
            }

            //Game over
            if (enemyGameboard.allShipsSunkLoggingTest()) {
                updateGameStatus("Player wins!");
                document.getElementById(enemyBoardContainer).removeEventListener('click', handlePlayerShot);
                return;
            }

            //Computer turn
            isPlayerTurn = false;
            computerTurn();
        }
    }
}


function updateGameStatus(message) {
    const gameStatusElement = document.getElementById('game-status');
    gameStatusElement.textContent = message;
}