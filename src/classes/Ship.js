function createShip(id, length) {
    let hits = 0;

    function getId(){
        return id;
    }

    function getLength(){
        return length;
    }

    function hit() {
        hits++;
    }

    function isSunk() {
        return hits === length;
    }

    return {
        getLength,
        getId,
        hit,
        isSunk,
    };
}

module.exports = createShip;
