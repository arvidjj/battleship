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
                board[y][x + i] = ship;
            }
        } else {
            for (let i = 0; i < ship.getLength(); i++) {
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
            return false;
        }

        //hit
        if (typeof target.hit === 'function') {
            target.hit();
            board[y][x] = 'hit';
            return true;
        }

        return false;
    }

    function allShipsSunk() {
        return ships.every(ship => ship.isSunk());
    }

    function isValidMove(x, y) {
        return board[y][x] === null;
    }

    return {
        getSize,
        placeShip,
        receiveAttack,
        allShipsSunk,
        isValidMove,
    };
}