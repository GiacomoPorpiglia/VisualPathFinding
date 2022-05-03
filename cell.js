class Cell {
    constructor(i, j) {
        this.x = i;
        this.y = j;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.neighbors = new Array();
        this.previous = undefined;
        this.isWall = false;
        this.visited = false; // for the maze generation
        this.mazeNeighbors = new Array();

        this.dist = Infinity; // Dijkstra;
    }

    addNeighbors = function () {
        this.neighbors = new Array();
        let allowDiagonal = document.getElementById("allowDiagonal").checked;
        if (this.y > 0) {
            this.neighbors.push(grid[this.x][this.y - 1]);
        }
        if (allowDiagonal && (this.x < c-1 && this.y > 0) && (!grid[this.x][this.y - 1].isWall || !grid[this.x + 1][this.y].isWall)) {
            this.neighbors.push(grid[this.x + 1][this.y-1]);
        }

        if (this.x < c - 1) {
            this.neighbors.push(grid[this.x + 1][this.y]);
        }

        if (allowDiagonal && (this.x < c - 1 && this.y < r - 1) && (!grid[this.x][this.y + 1].isWall || !grid[this.x + 1][this.y].isWall)) {
            this.neighbors.push(grid[this.x + 1][this.y + 1]);
        }
        if (this.y < r - 1) {
            this.neighbors.push(grid[this.x][this.y + 1]);
        }

        if (allowDiagonal && (this.x > 0 && this.y < r - 1) && (!grid[this.x][this.y + 1].isWall || !grid[this.x - 1][this.y].isWall)) {
            this.neighbors.push(grid[this.x - 1][this.y + 1]);
        }

        if (this.x > 0) {
            this.neighbors.push(grid[this.x - 1][this.y]);
        }

        if (allowDiagonal && (this.x > 0 && this.y > 0) && (!grid[this.x][this.y - 1].isWall || !grid[this.x - 1][this.y].isWall)) {
            this.neighbors.push(grid[this.x - 1][this.y - 1]);
        }
    };


    getMazeNeighbors = function() {
        this.mazeNeighbors = new Array();
        if (this.y - 2 >= 1 && !grid[this.x][this.y - 2].visited) {
            this.mazeNeighbors.push(grid[this.x][this.y - 2]);
        }
        if (this.x + 2 < c-1 && !grid[this.x+2][this.y].visited) {
            this.mazeNeighbors.push(grid[this.x + 2][this.y]);
        }
        if (this.y + 2 < r-1 && !grid[this.x][this.y + 2].visited) {
            this.mazeNeighbors.push(grid[this.x][this.y + 2]);
        }
        if (this.x - 2 >= 1 && !grid[this.x-2][this.y].visited) {
            this.mazeNeighbors.push(grid[this.x - 2][this.y]);
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
};

includes = function (elem, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == elem) {
            return true;
        }
    }
    return false;
};

heuristic = function (from, to, type) {
    let dx = Math.abs(from.x-to.x);
    let dy = Math.abs(from.y-to.y);
    if(type=="euclidean")
        var d = Math.sqrt(dx*dx + dy*dy); //EUCLIDEAN
    else if(type=="manhattan")
        var d = dx + dy; //MANHATTAN
    else if(type == "octile") {
        if (dx > dy) d = (1 * (dx - dy) + 1.414 * dy);
        else d = (1 * (dy - dx) + 1.414 * dx);
    }
    return d;
};
