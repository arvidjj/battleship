
export function createPlayer() {
    function takeTurn(gameboard, x, y) {
      return gameboard.receiveAttack(x, y);
    }
  
    function takeRandomTurn(gameboard) {
      let x, y;
      do {
        x = Math.floor(Math.random() * gameboard.getSize());
        y = Math.floor(Math.random() * gameboard.getSize());
      } while (!gameboard.isValidMove(x, y)); 
  
      return gameboard.receiveAttack(x, y);
    }
  
    return {
      takeTurn,
      takeRandomTurn,
    };
  }
  