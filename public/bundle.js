var rows = 21;
var cols = 41;
var grabbed = null;

var pathVisible = false;

var path = [];

var startX = 0, startY = 0, endX = cols-1, endY = rows-1;

var openSet = new Array();
var closedSet = new Array();

var GRID = new Array(cols);

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




window.onload = function() {
    console.log("HI");
    generate()
    var grid = document.querySelector('.grid')
    //TOGGLED WHEN YOU CLICK ON THE GRID
    grid.addEventListener("mousedown", controlMouseDown)

    //TOGGLED WHEN YOU STOP CLICKING
    grid.addEventListener("mouseup", function(e) {
        grabbed = null;
    })

    //TOGGLED WHEN YOU MOVE THE MOUSE ON THE GRID
    grid.addEventListener("mousemove", controlMouseMove) 

    document.querySelector('#calculatePathButton').addEventListener("click", () => calculatePath(true))


    document.querySelector('#clearWallsButton').addEventListener("click", clearWalls)

    document.querySelector('#generateMazeButton').addEventListener("click", generateMaze)

    document.querySelector('#algorithmSelector').addEventListener("change", enableHeuristic)

    document.querySelector('#heuristicSelector').addEventListener("change", hydeHeuristicAlert)

     document.querySelector('#algorithmSelector').addEventListener("change", hydeAlgorithmAlert)
}


//CREATE GRID
const generate = () => {
    var grid = document.querySelector('.grid')

    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            
            let cell = document.createElement('div')
            cell.className = 'cell'
            if( i == 0 && j == 0) {
                cell.classList.add('start')
            }
            if( i == rows-1 && j == cols-1) {
                cell.classList.add('end')
            }
            grid.appendChild(cell)
        }
    }


    //CREATE GRID ARRAY, USED BY THE ALGORITHMS
    for(let i = 0; i < cols; i++) {
        GRID[i] = new Array(rows);
        for(let j = 0; j < rows; j++) {
            GRID[i][j] = new Cell(i, j);
        }
    }
}

const clearWalls = () => {
    let gridElement = document.querySelector('.grid')
    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            GRID[i][j].isWall = false;
            gridElement.childNodes[i + j*cols + 1].classList.remove('wall')
        }
    }
    calculatePath()
}

const enableHeuristic = () => {
    let algorithm = document.querySelector('#algorithmSelector').value;
    if(algorithm == "astar") {
        document.querySelector('#heuristicSelector').removeAttribute("disabled")
        document.querySelector('#heuristicSelector').style.textDecoration = ""
    } else {
        document.querySelector('#heuristicSelector').setAttribute("disabled", "disabled")
        document.querySelector('#heuristicSelector').style.textDecoration = "line-through"
    }
}

const hydeHeuristicAlert = () => {
    let heuristicValue = document.querySelector('#algorithmSelector').value;
    if(heuristicValue != "unpicked") {
        document.querySelector("#heuristicAlert").style.visibility = "hidden" // HYDE THE ALERT THAT TELLS YOU HAVE NOT PICKED A HEURISTIC
    }
}

const hydeAlgorithmAlert = () => {
    let algorithmValue = document.querySelector('#algorithmSelector').value;
    if(algorithmValue != "unpicked") {
        document.querySelector("#algorithmAlert").style.visibility = "hidden" // HYDE THE ALERT THAT TELLS YOU HAVE NOT PICKED A HEURISTIC
    }
}

const controlMouseDown = (e) => {
    var grid = $('.grid')
    var X, Y;
    X = e.pageX - grid.offset().left;
    Y = e.pageY - grid.offset().top;

    var cellX, cellY;
    var positionInfo = document.querySelector('.grid').getBoundingClientRect();
    var height = positionInfo.height;
    var width = positionInfo.width;
    cellX = Math.floor((X * cols) / width);
    cellY = Math.floor((Y * rows) / height);

    //e.button == 0 ----> left button of the mouse 
    //e.button == 2 ----> right button of the mouse

    if(cellX == startX && cellY == startY && e.button == 0) grabbed = document.querySelector('.start')
    else if(cellX == endX && cellY == endY && e.button == 0) grabbed = document.querySelector('.end')
    else if(document.querySelector('.grid').childNodes[cellX + cellY*cols+1].classList.contains('wall') && e.button == 0) {
        grabbed = "wall"
    } else if(e.button == 0) grabbed = "none"
} 


const controlMouseMove = (e) => {
    var grid = $('.grid')
    var X, Y;
    X = e.pageX - grid.offset().left;
    Y = e.pageY - grid.offset().top;

    var cellX, cellY;
    var positionInfo = document.querySelector('.grid').getBoundingClientRect();
    var height = positionInfo.height;
    var width = positionInfo.width;
    cellX = Math.floor((X * cols) / width);
    cellY = Math.floor((Y * rows) / height);

    //if not holding the mouse down, do nothing
    if(grabbed == null) {

    } 
    //if the starting point is selected
    else if(grabbed == document.querySelector('.start') && !document.querySelector('.grid').childNodes[cellX + cellY*cols+1].classList.contains('wall', 'end')) {
        if(cellX != startX || cellY != startY) {
            startX = cellX;
            startY = cellY;
            document.querySelector('.start').classList.remove('start', 'wall', 'path')
            var index = cellX + cellY*cols+1;
            document.querySelector('.grid').childNodes[index].classList.add('start')

            grabbed = document.querySelector('.start')
            GRID[cellX][cellY].isWall = false;

            calculatePath(); // SHOW THE PATH WITH THE NEW START POINT
        }
    }
    //if the ending point is selected
    else if(grabbed == document.querySelector('.end')  && !document.querySelector('.grid').childNodes[cellX + cellY*cols+1].classList.contains('wall', 'start')) {
        if(cellX != endX || cellY != endY) {
            endX = cellX;
            endY = cellY;
            document.querySelector('.end').classList.remove('end', 'wall', 'path')
            var index = cellX + cellY*cols+1;
            document.querySelector('.grid').childNodes[index].classList.add('end')

            grabbed = document.querySelector('.end')
            GRID[cellX][cellY].isWall = false;

            calculatePath(); // SHOW THE PATH WITH THE NEW END POINT
        }
    } 
    //if an empty cell is selected, make it a wall
    else if(grabbed == "none") {
        if((cellX != startX || cellY != startY) && (cellX != endX || cellY != endY)) {
            var index = cellX + cellY*cols + 1;

            var newWall = false;
            document.querySelector('.grid').childNodes[index].classList.remove('start', 'end', 'path')
            document.querySelector('.grid').childNodes[index].classList.add('wall')
            if(GRID[cellX][cellY].isWall == false) {
                GRID[cellX][cellY].isWall = true;
                newWall = true;
            }
            
            if(newWall) { // IF THE CELL IS BECOMING A WALL IN THIS MOMENT (to avoid calling calculatePath too many times)
                for (let i = 0; i < path.length; i++) {
                    if (!document.getElementById('diagonalsCheckbox').checked) {
                        if ((path[i].x == cellX && path[i].y == cellY)) {
                            calculatePath();
                            break;
                        }
                    } else if (document.getElementById('diagonalsCheckbox').checked && Math.abs(path[i].x - cellX) <= 1 &&  Math.abs(path[i].y - cellY) <= 1) {
                        calculatePath();
                        break;
                    }
                }
            }

        }
    } 
    //if an wall cell is selected, make it an empty one
    else if(grabbed == "wall") {
        if((cellX != startX || cellY != startY) && (cellX != endX || cellY != endY)) {
            var index = cellX + cellY*cols + 1;
            
            if(GRID[cellX][cellY].isWall) {
                document.querySelector('.grid').childNodes[index].classList.remove('start', 'end', 'wall', 'path')
                GRID[cellX][cellY].isWall = false;
                calculatePath(); // SHOW THE PATH WITH THE NEW WALLS
            }
        }
    }
}

const heuristic = (from, to, type) => {
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


const generateMaze = () => {
    clearWalls()
    reset()

    for(let i = 0; i < path.length; i++) {
        document.querySelector('.grid').childNodes[path[i].x + path[i].y*cols +1].classList.remove('path')
    }

    path = []
    let prevStart = document.querySelector('.start')
    let prevEnd = document.querySelector('.end')
    prevStart.classList.remove('start')
    prevEnd.classList.remove('end')
    startX = startY = 1;
    endX = cols-2; endY = rows-2;
    document.querySelector('.grid').childNodes[startX + startY*cols + 1].classList.add('start')
    document.querySelector('.grid').childNodes[endX + endY*cols + 1].classList.add('end')
    let start = GRID[startX][startY]
    let end = GRID[endX][endY]

    var current = start;
    current.visited = true

    var stack = new Array()
    stack.push(current)

    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            if ((i == rows - 1 || j == cols - 1) || (i % 2 != 0 && j % 2 == 0) || (i%2==0)) {
                let cell = document.querySelector('.grid').childNodes[j + i * cols + 1];
                cell.classList.add("wall");
                GRID[j][i].isWall = true;
            }
        }
    }

    while(stack.length > 0) {
        
        var currNeighbors = current.getMazeNeighbors()

        if(currNeighbors.length > 0) {
            let random = Math.round(Math.random() * (currNeighbors.length-1));
            var next = currNeighbors[random];
            stack.push(current);
            removewall(current, next);
            current = next;
            current.visited = true;
        } else if(stack.length > 0) {
            current = stack.pop();
        }
    }

}


const removewall = (cell1, cell2) => {
    let xNeighbor = (cell1.x + cell2.x) / 2;
    let yNeighbor = (cell1.y + cell2.y) / 2;
    let cell = document.querySelector('.grid').childNodes[xNeighbor + yNeighbor * cols + 1];
    cell.classList.remove("wall");
    GRID[xNeighbor][yNeighbor].isWall = false;
}


const handleSelectHeuristicError = () => {
    document.querySelector("#heuristicAlert").style.visibility = "visible"
}
const handleSelectAlgorithmError = () => {
    document.querySelector("#algorithmAlert").style.visibility = "visible"
}


var start, end;
const animationSpeed = 3;
const calculatePath = (animating) => {

    if(document.querySelector('#algorithmSelector').value == "unpicked") {
            handleSelectAlgorithmError()
            return
        }

    let heuristicType;
    let gridElement = document.querySelector('.grid')
    for(let i = 0; i < path.length; i++) {
        gridElement.childNodes[path[i].x + path[i].y*cols +1].classList.remove('path');
    }
    if(animating) { 
        pathVisible = true;
    }

    if(!animating && pathVisible) {
        reset();
        path = [];
        start = GRID[startX][startY];
        end = GRID[endX][endY];
        if(document.querySelector('#algorithmSelector').value=="dijkstra") {
             
            let start = window.performance.now(); // Measure exection time of the function 

            path = dijkstra();  

            let end = window.performance.now(); // Measure exection time of the function 
            document.querySelector('#execTimeParagraph').innerHTML = "Execution time: " + (end-start).toFixed(2) + ' ms';

        } else if(document.querySelector('#algorithmSelector').value=="astar") {
            heuristicType = document.querySelector('#heuristicSelector').value
            if(heuristicType == "unpicked") { // IF USER HASN'T PICKED A HEURISTIC
                handleSelectHeuristicError()
                return
            }

            let start = window.performance.now(); // Measure exection time of the function 

            path = astar(heuristicType);

            let end = window.performance.now(); // Measure exection time of the function 
            document.querySelector('#execTimeParagraph').innerHTML = "Execution time: " + (end-start).toFixed(2) + ' ms';

        } else if(document.querySelector('#algorithmSelector').value=="breadth-first") {
            heuristicType = document.querySelector('#heuristicSelector').value
            let start = window.performance.now(); // Measure exection time of the function 

            path = breadthfisrt(); 

            let end = window.performance.now(); // Measure exection time of the function 
            document.querySelector('#execTimeParagraph').innerHTML = "Execution time: " + (end-start).toFixed(2) + ' ms';
        }
        
        drawPath(path);

    } else if(pathVisible) {
        path = [];
        reset();
        if(document.querySelector('#algorithmSelector').value=="dijkstra") {
            GRID[startX][startY].f = 0;
            start = GRID[startX][startY];
            start.f = 0;openSet.push(start)
            drawDijkstraAnimating();

        } 
        else if(document.querySelector('#algorithmSelector').value=="astar") {
            heuristicType = document.querySelector('#heuristicSelector').value
            if(heuristicType == "unpicked") { // IF USER HASN'T PICKED A HEURISTIC
                handleSelectHeuristicError()
                return
            }
            start = GRID[startX][startY];
            end = GRID[endX][endY];
            start.h = heuristic(start, end, heuristicType);
            start.f = start.h;
            openSet.push(start);
            drawAstarAnimating(heuristicType);
        }
        else if(document.querySelector('#algorithmSelector').value=="breadth-first") {
            start = GRID[startX][startY];
            end = GRID[endX][endY];
            openSet.push(start);
            drawBreadthAnimating();
        }
        
    }
    
}

const calculatePathLength = (path) => {
    let pathLength = 0;
    for(let i = 0; i < path.length-1; i++) {
        pathLength+=heuristic(path[i], path[i+1], 'euclidean')
    }
    return pathLength;
}


const reset = () => {
    
    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            GRID[i][j].f = Infinity;
            GRID[i][j].g = 0;
            GRID[i][j].h = 0;
            GRID[i][j].previous = undefined;
            GRID[i][j].visited = false;
            GRID[i][j].addNeighbors();
        }
    }
    let gridElement = document.querySelector('.grid')
    for(let i = 0; i < openSet.length; i++) {
        gridElement.childNodes[openSet[i].x+openSet[i].y*cols +1].classList.remove('openSet')
    }

    for(let i = 0; i < closedSet.length; i++) {
        gridElement.childNodes[closedSet[i].x+closedSet[i].y*cols +1].classList.remove('closedSet')
    }
    openSet = [];
    closedSet = [];

}

const drawPath = (path) => {
    for(let i = 0; i < closedSet.length; i++) {
        document.querySelector('.grid').childNodes[closedSet[i].x + closedSet[i].y*cols+1].classList.add('closedSet')
    }
    for(let i = 0; i < openSet.length; i++) {
        document.querySelector('.grid').childNodes[openSet[i].x + openSet[i].y*cols+1].classList.add('openSet')
    }
    for(let i = 1; i < path.length-1; i++) {
        document.querySelector('.grid').childNodes[path[i].x + path[i].y*cols+1].classList.add('path')
    }
    //UPDATE LENGTH OF THE PATH SHOWN ON THE TEXT
    document.querySelector('#lengthParagraph').innerHTML = "Path length: " + calculatePathLength(path).toFixed(2);
}

const astar = (heuristicType) => {
    var start = GRID[startX][startY];
    var end = GRID[endX][endY];
    start.h = heuristic(start, end, heuristicType);
    start.f = start.h;
    openSet.push(start);
    var tentativeIsBetter = false;
    while (openSet.length > 0) {
        var lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }
        var current = openSet[lowestIndex];
        if (current === end) {
            var temp = current;
            path.push(temp);
            while (temp.previous) {
                path.push(temp.previous);
                temp = temp.previous;
            }
            // console.log(path);
            return path;
        }
        removeFrom(current, openSet);
        closedSet.push(current);

        var neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if (!includes(neighbor, closedSet) && !neighbor.isWall) {
                var tentativeG = current.g + heuristic(current, neighbor, "euclidean");
                if (includes(neighbor, openSet)) {
                    if (tentativeG < neighbor.g) {
                        tentativeIsBetter = true;
                    }
                } else {
                    openSet.push(neighbor);
                    tentativeIsBetter = true;            
                }                       
            }
            if (tentativeIsBetter) {
                neighbor.g = tentativeG;
                neighbor.h = heuristic(neighbor, end, heuristicType);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;
                tentativeIsBetter = false;
            }
        }
    }
    return [];
}



const drawAstarAnimating = (heuristicType) => {
    let end = GRID[endX][endY]
    let tentativeIsBetter = false
    setTimeout(function () {
        if (openSet.length > 0) {
            showAnimatedCells();
            var lowestIndex = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[lowestIndex].f) {
                    lowestIndex = i;
                }
            }
            var current = openSet[lowestIndex];
            if (current === end) {
                var temp = current;
                path.push(temp);
                while (temp.previous) {
                    path.push(temp.previous);
                    temp = temp.previous;
                }
                // showPathAnimating(1);
                drawPath(path);
                return null;
            }
            removeFrom(current, openSet);
            closedSet.push(current);

            var neighbors = current.neighbors;
            for (let i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];
                if (!includes(neighbor, closedSet) && !neighbor.isWall) {
                    var tentativeG = current.g + heuristic(current, neighbor, heuristicType);
                    if (includes(neighbor, openSet)) {
                        if (tentativeG < neighbor.g) {
                            tentativeIsBetter = true;
                        }
                    } else {
                        openSet.push(neighbor);
                        tentativeIsBetter = true;
                    }                    
                }
                if (tentativeIsBetter) {
                    neighbor.g = tentativeG;
                    neighbor.h = heuristic(neighbor, end, heuristicType);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                    tentativeIsBetter = false;
                }
            }
            drawAstarAnimating(heuristicType);
        } else {
            showAnimatedCells();
            return null;
        }
    }, animationSpeed)

}


const breadthfisrt = () => {
    let start = GRID[startX][startY]
    let end = GRID[endX][endY]
    let tentativeIsBetter = false
    start.f = 0;
    openSet.push(start);
    while (openSet.length > 0) {
        var lowestIndex = 0;
        var current = openSet[lowestIndex];
        
        if (current === end) {
            var temp = current;
            path.push(temp);
            while (temp.previous) {
                path.push(temp.previous);
                temp = temp.previous;
            }
            // console.log(path);
            return path;
        }

        removeFrom(current, openSet);
        closedSet.push(current);

        var neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if (!includes(neighbor, closedSet) && !neighbor.isWall) {
                var tentativeG = current.g + heuristic(current, neighbor, 'euclidean');
                if (includes(neighbor, openSet)) {
                    if (tentativeG < neighbor.g) tentativeIsBetter = true;  
                } else {
                    openSet.push(neighbor);
                    tentativeIsBetter = true;
                }
                if (tentativeIsBetter) {
                    neighbor.g = tentativeG;
                    neighbor.f = neighbor.g;
                    neighbor.previous = current;
                    tentativeIsBetter = false;
                }
            }
        }
    }
    return [];
}


const drawBreadthAnimating = () => {
    let end = GRID[endX][endY]
    var tentativeIsBetter = false;
    setTimeout(function () {
        if (openSet.length > 0) {
            showAnimatedCells();
            var lowestIndex = 0;
            var current = openSet[lowestIndex];
            
            if (current === end) {
                var temp = current;
                path.push(temp);
                while (temp.previous) {
                    path.push(temp.previous);
                    temp = temp.previous;
                }
                // showPathAnimating(1);
                drawPath(path);
                return null;
            }

            removeFrom(current, openSet);
            closedSet.push(current);

            var neighbors = current.neighbors;
            for (let i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];
                if (!includes(neighbor, closedSet) && !neighbor.isWall) {
                    var tentativeG = current.g + heuristic(current, neighbor, 'euclidean');
                    if (includes(neighbor, openSet)) {
                        if (tentativeG < neighbor.g) tentativeIsBetter = true;
                    } else {
                        openSet.push(neighbor);
                        tentativeIsBetter = true;
                    }
                    if (tentativeIsBetter) {
                        neighbor.g = tentativeG;
                        neighbor.f = neighbor.g;
                        neighbor.previous = current;
                        tentativeIsBetter = false;
                    }
                   
                }
            }
            drawBreadthAnimating();
        } else {
            showAnimatedCells();
            return null;
        }
    }, animationSpeed)
}


const dijkstra = () => {

    var start = GRID[startX][startY];
    var end = GRID[endX][endY];
    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            GRID[i][j].f = Infinity;
            GRID[i][j].previous = undefined;
            GRID[i][j].addNeighbors();
        }
    }
    
    start.f = 0;
    openSet.push(start);
    while(openSet.length > 0) {
        var lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }
        var current = openSet[lowestIndex];
        removeFrom(current, openSet);
        closedSet.push(current);
        if (current === end) {
            var temp = current;
            path.push(temp);
            while (temp.previous) {
                path.push(temp.previous);
                temp = temp.previous;
            }
            return path;
        }

        
        var neighbors = current.neighbors;
        for(let i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if (!includes(neighbor, closedSet) && !neighbor.isWall) {
                let tentativeF = current.f + heuristic(current, neighbor, "euclidean");;
                if(includes(neighbor, openSet)) {
                    if(tentativeF < neighbor.f) {
                        neighbor.f = tentativeF;
                        neighbor.previous = current;
                    }
                } else {
                    openSet.push(neighbor);
                    neighbor.f = tentativeF;
                    neighbor.previous = current;
                }
            }
        }

    }
    return [];
}



const drawDijkstraAnimating = () => {
    var start = GRID[startX][startY];
    var end = GRID[endX][endY];

    
    start.f = 0;
    // openSet.push(start);
    setTimeout(function () {
        if (openSet.length > 0) {
            showAnimatedCells();
            var lowestIndex = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[lowestIndex].f) {
                    lowestIndex = i;
                }
            }
            var current = openSet[lowestIndex];
            removeFrom(current, openSet);
            closedSet.push(current);
            if (current === end) {
                var temp = current;
                path.push(temp);
                while (temp.previous) {
                    path.push(temp.previous);
                    temp = temp.previous;
                }
                drawPath(path);
                return null;
            }


            var neighbors = current.neighbors;
            for (let i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];
                if (!includes(neighbor, closedSet) && !neighbor.isWall) {

                    let tentativeF = current.f  + heuristic(current, neighbor, "euclidean");;
                    if (includes(neighbor, openSet)) {
                        if (tentativeF < neighbor.f) {
                            neighbor.f = tentativeF;
                            neighbor.previous = current;
                        }
                    } else {
                        openSet.push(neighbor);
                        neighbor.f = tentativeF;
                        neighbor.previous = current;
                    }
                }
            }
            drawDijkstraAnimating();
        } else {
            showAnimatedCells();
            return null;
        }
    }, animationSpeed)
}

const showAnimatedCells = () => {
    for (let i = 1; i < closedSet.length; i++) {
        let cell = document.querySelector('.grid').childNodes[closedSet[i].x + closedSet[i].y * cols +1];
        cell.classList.remove("pathCell", "openSet", "openSetAnimation");
        cell.classList.add("closedSet", "closedSetAnimation");
    }

    for (let i = 0; i < openSet.length; i++) {
        if ((openSet[i].x != endX || openSet[i].y != endY) && (openSet[i].x != startX || openSet[i].y != startY)) {
            let cell = document.querySelector('.grid').childNodes[openSet[i].x + openSet[i].y * cols +1];
            if(!cell.classList.contains("openSet")) {
                cell.classList.remove("closedSet", "closedSetAnimatoin", "pathCell");
                cell.classList.add("openSet", "openSetAnimation");
            }
        }
    }
}