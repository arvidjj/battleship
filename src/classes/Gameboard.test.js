const createGameboard = require('./Gameboard');
const createShip = require('./Ship');

describe('Gameboard', () => {
    
  test('placeShip() should place a ship on the board, and every hit should register', () => {
    const gameboard = createGameboard();
    const ship = createShip(0,3);
    gameboard.placeShip(ship, 0, 0, true);
    expect(gameboard.receiveAttack(0, 0)).toBe(true);
    expect(gameboard.receiveAttack(1, 0)).toBe(true);
    expect(gameboard.receiveAttack(2, 0)).toBe(true);
  });

  test('receiveAttack() should register misses', () => {
    const gameboard = createGameboard();
    const ship = createShip(1, 2);
    gameboard.placeShip(ship, 1, 1, true);
    expect(gameboard.receiveAttack(1, 1)).toBe(true);
    expect(gameboard.receiveAttack(1, 2)).toBe(false);
    expect(gameboard.receiveAttack(2, 1)).toBe(true);
  });

  test('allShipsSunk() should return true when all ships are sunk', () => {
    const gameboard = createGameboard();
    const ship1 = createShip(2, 2);
    const ship2 = createShip(3, 3);
    gameboard.placeShip(ship1, 0, 0, true);
    gameboard.placeShip(ship2, 2, 3, false);
    ship1.hit();
    ship1.hit();
    ship2.hit();
    ship2.hit();
    ship2.hit();
    expect(gameboard.allShipsSunk()).toBe(true);
  });

  test('allShipsSunk() should return false when not all ships are sunk', () => {
    const gameboard = createGameboard();
    const ship1 = createShip(4, 3);
    const ship2 = createShip(5, 2);
    gameboard.placeShip(ship1, 2, 2, true);
    gameboard.placeShip(ship2, 5, 5, true);
    ship1.hit();
    ship2.hit();
    expect(gameboard.allShipsSunk()).toBe(false);
  });
  
});
