const createShip = require('./Ship');

describe('Ship', () => {
  test('hit() should increase hit count', () => {
    const ship = createShip(0,4);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test('isSunk() should return true when the hits the ship has its the same of its length', () => {
    const ship = createShip(1,3);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test('isSunk() should return false when hits are less than its length', () => {
    const ship = createShip(2,5);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });
});
