//the ships get stored in each point in the matrix (arrray of arrays)
//so a ship instance is just a part of the ship, however, when they get stored in the ships array
//you can save the hits each ship has
export function createGameboard() {
    const boardSize = 10;
    const board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
    const ships = [];

    function getSize() {
        return boardSize;
    }

    function placeShip(ship, x, y, isHorizontal) {
        if (isHorizontal) {
            for (let i = 0; i < ship.getLength(); i++) {
                console.log("placed ship: " + ship.getId())
                board[y][x + i] = ship;
            }
        } else {
            for (let i = 0; i < ship.getLength(); i++) {
                console.log("placed ship: " + ship.getId())
                board[y + i][x] = ship;
            }
        }
        ships.push(ship);
    }

    function receiveAttack(x, y) {
        //invalid coordinates
        if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
            return false;
        }

        const target = board[y][x];
        //miss
        if (target === null) {

            board[y][x] = 'miss';
            console.log("miss")
            return false;
        }

        //hit
        if (typeof target.hit === 'function') {
            target.hit();
            board[y][x] = 'hit';
            console.log("hit")
            return true;
        }

        return false;
    }

    function getCellContent(x, y) {
        const cellValue = board[y][x];
        if (cellValue === null) {
            return '-'; //return empty symbol
        } else if (cellValue === 'miss') {
            return 'X'; //return Miss symbol 
        } else if (typeof cellValue.isSunk === 'function' && cellValue.isSunk()) {
            return 'S'; //return Sunk ship symbol 
        } else {
            return 'O'; //return Ship symbol 
        }
    }

    function allShipsSunk() {
        return ships.every(ship => ship.isSunk());
    }

    function isValidMove(x, y) {
        return board[y][x] === null;
    }


    function printBoard() {
        for (let y = 0; y < boardSize; y++) {
            let row = '';
            for (let x = 0; x < boardSize; x++) {
                row += getCellContent(x, y) + ' ';
            }
            console.log(row);
        }
    }

    return {
        getSize,
        placeShip,
        receiveAttack,
        allShipsSunk,
        isValidMove,
        getCellContent,
        printBoard,
    };
}