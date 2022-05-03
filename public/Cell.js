class Cell {
    constructor(i, j) {
        this.x = i;
        this.y = j;
        this.f = 0;
        this.h = 0;
        this.g = 0;
        this.previous = undefined;
        this.isWall = false;
        this.visited = false;
        this.dist = Infinity;
        this.neighbors = new Array();
    }

    addNeighbors = function() {
        this.neighbors = []
        var allowDiagonal = document.querySelector('#diagonalsCheckbox').checked;
        if (this.y > 0) {
            this.neighbors.push(GRID[this.x][this.y - 1]);
        }
        if (allowDiagonal && (this.x < cols-1 && this.y > 0) && (!GRID[this.x][this.y - 1].isWall || !GRID[this.x + 1][this.y].isWall)) {
            this.neighbors.push(GRID[this.x + 1][this.y-1]);
        }
        if (this.x < cols - 1) {
            this.neighbors.push(GRID[this.x + 1][this.y]);
        }
        if (allowDiagonal && (this.x < cols - 1 && this.y < rows - 1) && (!GRID[this.x][this.y + 1].isWall || !GRID[this.x + 1][this.y].isWall)) {
            this.neighbors.push(GRID[this.x + 1][this.y + 1]);
        }
        if (this.y < rows - 1) {
            this.neighbors.push(GRID[this.x][this.y + 1]);
        }
        if (allowDiagonal && (this.x > 0 && this.y < rows - 1) && (!GRID[this.x][this.y + 1].isWall || !GRID[this.x - 1][this.y].isWall)) {
            this.neighbors.push(GRID[this.x - 1][this.y + 1]);
        }
        if (this.x > 0) {
            this.neighbors.push(GRID[this.x - 1][this.y]);
        }    
        if (allowDiagonal && (this.x > 0 && this.y > 0) && (!GRID[this.x][this.y - 1].isWall || !GRID[this.x - 1][this.y].isWall)) {
            this.neighbors.push(GRID[this.x - 1][this.y - 1]);
        }
    }

    getMazeNeighbors = function() {
        this.mazeNeighbors = new Array();
        if (this.y - 2 >= 1 && !GRID[this.x][this.y - 2].visited) {
            this.mazeNeighbors.push(GRID[this.x][this.y - 2]);
        }
        if (this.x + 2 < cols-1 && !GRID[this.x+2][this.y].visited) {
            this.mazeNeighbors.push(GRID[this.x + 2][this.y]);
        }
        if (this.y + 2 < rows-1 && !GRID[this.x][this.y + 2].visited) {
            this.mazeNeighbors.push(GRID[this.x][this.y + 2]);
        }
        if (this.x - 2 >= 1 && !GRID[this.x-2][this.y].visited) {
            this.mazeNeighbors.push(GRID[this.x - 2][this.y]);
        }
        return this.mazeNeighbors;
    }
}

    removeFrom = function (elem, arr) {
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == elem) {
                arr.splice(i, 1);
            }
        }
    }

    includes = function (elem, arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == elem) {
                return true;
            }
        }
        return false;
    }