window.onload = createGrid;
var walls = true;
var draggingEndPoint = false;
var draggingStartPoint = false;
var rubber = false; 
var r = 21;
var c = 53;
var pathVisible = false;
var rubberVisible = false;

var draggingStartPoint = false;
var draggingEndPoint = false;

var animating = false;

function createGrid() {
    var grid = document.getElementById("container");
    for(let i=0; i < r*c; i++) {
        var node = document.createElement("div");
        node.className = "gridElem";
        grid.appendChild(node);
    }
    document.documentElement.style.setProperty('--rows', r);
    document.documentElement.style.setProperty('--columns', c);

    let startCell = grid.children.item(startx + starty*c);
    startCell.classList.add("startCell");
    let endCell = grid.children.item(endx + endy*c);
    endCell.classList.add("endCell");

    var tag = document.createElement("script");
    tag.src = "dragDiv.js";
    document.getElementsByTagName("head")[0].appendChild(tag);

    var svg = document.getElementById("svg");
    svg.style.width = grid.getBoundingClientRect().width;
    svg.style.height = grid.getBoundingClientRect().height;
    svg.style.right = document.getElementById('container').getBoundingClientRect().right;
    svg.style.left = document.getElementById('container').getBoundingClientRect().left;
    svg.style.top = document.getElementById('container').getBoundingClientRect().top;
}

window.onresize = function() {
    var svg = document.getElementById("svg");
    svg.style.width = document.getElementById('container').getBoundingClientRect().width;
    svg.style.height = document.getElementById('container').getBoundingClientRect().height;
    svg.style.right = document.getElementById('container').getBoundingClientRect().right;
    svg.style.left = document.getElementById('container').getBoundingClientRect().left;
    svg.style.top = document.getElementById('container').getBoundingClientRect().top;
    if(pathVisible) {
        drawSvgPath(path);
    }
};

var mouseX, mouseY, container, positionInfo, height, width, gridX, gridY;
var previousWallX = undefined; // USED TO AVOID MULTIPLE CALLS OF CALCULATE PATH WHEN PLACING NEW WALLS
var previousWallY = undefined;
var algorithmType = undefined;
var heuristicType = undefined;

function updateAlgorithm(value) {
    algorithmType = value;

    document.getElementById("errorDiv").style.visibility = "hidden";

    document.getElementById('calculateButton').innerHTML = "Visualize " + algorithmType + "!";
    document.getElementById('algorithmDropdownTitle').innerHTML = "Algorithm: " + value[0].toUpperCase() + value.slice(1); //Slice to make the first letter capital
    if(value == "BFS" || value == "dijkstra") {
        document.getElementById('heuristicDropdownTitle').style.textDecoration = "line-through";
    } else {
        document.getElementById('heuristicDropdownTitle').style.textDecoration = "none";
    }
}

function updateHeuristic(value) {
    heuristicType = value;

    document.getElementById("errorDiv").style.visibility = "hidden";

    document.getElementById('heuristicDropdownTitle').innerHTML = "Heuristic: " + value[0].toUpperCase() + value.slice(1);//Slice to make the first letter capital
}
function mousePressed() {
    $("#svg").on("mousemove", function (e) {
        var container = $("#container");
        if (e.which == 1 && !animating) {
            
            mouseX = e.pageX - container.offset().left;
            mouseY = e.pageY - container.offset().top;
        
            
            positionInfo = document.getElementById("container").getBoundingClientRect();
            height = positionInfo.height;
            width = positionInfo.width;

            gridX = Math.floor((mouseX * c) / width);
            gridY = Math.floor((mouseY * r) / height);



            if ((gridX == startx && gridY == starty && (gridX!=endx || gridY!=endy))) {
                draggingStartPoint = true;
                walls = false;
                draggingEndPoint = false;
            } else if (gridX == endx && gridY == endy && (gridX != startx || gridY != starty)) {
                draggingEndPoint = true;
                draggingStartPoint = false;
                walls = false;
            }

            if(walls) {
                if ((gridX != startx || gridY != starty) && (gridX != endx || gridY != endy)) { // CHECK THAT THAT POINT IT'S NOT THE START OR THE END
                    grid[gridX][gridY].isWall = true; // MAKES THE POINT YOU CLICK A WALL
                    let cell = document.getElementById("container").children.item(gridX + gridY * c);
                    cell.classList.add("wall");
                    if (gridX != previousWallX || gridY != previousWallY) {
                        for (i = 0; i < path.length; i++) {
                            if (!document.getElementById('allowDiagonal').checked) {
                                if ((path[i].x == gridX && path[i].y == gridY)) {
                                    calculatePath();
                                    break;
                                }
                            } else if (document.getElementById('allowDiagonal').checked && Math.abs(path[i].x - gridX) <= 1 && Math.abs(path[i].y - gridY) <= 1) {
                                calculatePath();
                                break;
                            }
                        }
                    }
                    previousWallX = gridX;
                    previousWallY = gridY;

                }
                
            }
            /*
            if (!draggingStartPoint && !draggingEndPoint && walls) {
                if ((gridX != startx || gridY != starty) && (gridX != endx || gridY != endy)) { // CHECK THAT THAT POINT IT'S NOT THE START OR THE END
                    grid[gridX][gridY].isWall = true; // ADD A WALL
                    let cell = container.children.item(gridX + gridY * c);
                    cell.classList.add("wall");
                    for (i = 0; i < path.length; i++) {
                        if(!document.getElementById('allowDiagonal').checked) {
                            if ((path[i].x == gridX && path[i].y == gridY)) {
                                calculatePath();
                                break;
                            }
                        } else if (document.getElementById('allowDiagonal').checked && Math.abs(path[i].x-gridX) <=1 && Math.abs(path[i].y-gridY) <=1) {
                            calculatePath();             
                            break;
                        }
                    }
                }
                
            } */
            else if (draggingStartPoint) {
                if ((gridX != startx || gridY != starty) && grid[gridX][gridY].isWall == false) {
                    let prevStart = document.getElementById("container").children.item(startx + starty * c);
                        prevStart.classList.remove("startCell");
                        startx = gridX;
                        starty = gridY;  
                    let cell = document.getElementById("container").children.item(gridX + gridY * c);
                        cell.classList.add("startCell");
                        calculatePath();
                }
            }
            else if (draggingEndPoint) {
                if ((endx != gridX || endy != gridY) && grid[gridX][gridY].isWall == false) {
                    let prevEnd = document.getElementById("container").children.item(endx + endy * c);
                    prevEnd.classList.remove("endCell");
                    endx = gridX;
                    endy = gridY;
                    let cell = document.getElementById("container").children.item(gridX + gridY * c);
                    cell.classList.add("endCell");
                    calculatePath();
                }   
            }
        } 


        else if(e.which==3 && !animating) { //RIGHT BUTTON PRESSED
            mouseX = e.pageX - container.offset().left;
            mouseY = e.pageY - container.offset().top;

            positionInfo = document.getElementById("container").getBoundingClientRect();
            height = positionInfo.height;
            width = positionInfo.width;

            gridX = Math.floor((mouseX * c) / width);
            gridY = Math.floor((mouseY * r) / height);
            if ((gridX != startx || gridY != starty) && (gridX != endx || gridY != endy) && (grid[gridX][gridY].isWall)) {
                grid[gridX][gridY].isWall = false; // REMOVE A WALL
                let cell = document.getElementById("container").children.item(gridX + gridY * c);
                cell.classList.remove("wall");
                if (pathVisible) calculatePath();
            }
        }



    });
}



function clearWalls() {
    if(!animating) {
    for (let i = 0; i < c; i++) {
        for(let j = 0; j < r; j++) {
        grid[i][j].isWall = false; // MAKES THE POINT YOU CLICK A WALL
        let cell = document.getElementById('container').children.item(i + j * c);
        cell.classList.remove("wall");
        }
    }
    if(algorithmType) {
        calculatePath();
    }
    
    }
}


function setRecalculation() {
    openSet = new Array();
    closedSet = new Array();
    start = grid[startx][starty];
    end = grid[endx][endy];
    path = [];
    for (let i = 0; i < c; i++) {
        for (let j = 0; j < r; j++) {
            grid[i][j].previous = undefined;
            grid[i][j].g = 0;
            grid[i][j].f = 0;
            grid[i][j].h = 0;
        }
    }
    
}

function resetClasses() {
    for (let i = 0; i < r * c; i++) {
        let cell = document.getElementById("container").children.item(i);
        cell.classList.remove("openSetAnimation", "closdedSetAnimation");
    }
    for (let i = 1; i < path.length - 1; i++) { // REMOVE THE CLASS PATHCELL FROM THE PREVIOUS PATH SO THAT THE NEW ONE IS DISPLAYED CORRECTLY
        let cell = document.getElementById('container').children.item(path[i].x + path[i].y * c);
        cell.classList.remove("pathCell");
    }
    for (let i = 0; i < closedSet.length; i++) {
        let cell = document.getElementById('container').children.item(closedSet[i].x + closedSet[i].y * c);
        cell.classList.remove("closedSetCell");
    }
    for (let i = 0; i < openSet.length; i++) {
        let cell = document.getElementById('container').children.item(openSet[i].x + openSet[i].y * c);
        cell.classList.remove("openSetCell");
    }

    
}

//-----------------------------------------------------------------------

function drawPath(path, source, algorithmType) {
    if(source == 'btn') {
        animating=true;
        setRecalculation();
        
        if (algorithmType == "A*") {
            start.h = heuristic(start, end, heuristicType);
            start.f = start.h;
            openSet.push(start);
            drawAstarAnimating(heuristicType); // the value you pass is the tipe of heuristic you want to use
        }
        else if (algorithmType =="BFS") {
            start.f = 0;
            openSet.push(start);
            drawBFSAnimating();
        }
        else if (algorithmType == "BTS") {
            start.h = heuristic(start, end, heuristicType);
            start.f = start.h;
            openSet.push(start);
            drawBTSAnimating(heuristicType); // the value you pass is the tipe of heuristic you want to use
        } else if (algorithmType == "dijkstra") {
            for (let i = 0; i < c; i++) {
                for (let j = 0; j < r; j++) {
                    grid[i][j].f = Infinity;
                    //openSet.push(grid[i][j]);
                }
            }
            start.f = 0;
            openSet.push(start);
            drawDijkstraAnimating(); // the value you pass is the tipe of heuristic you want to use
        }


    } else { // IF NOT ANIMATING
        for (let i = 1; i < closedSet.length; i++) {
            let cell = document.getElementById('container').children.item(closedSet[i].x + closedSet[i].y * c);
            cell.classList.remove("pathCell", "openSetCell", "closedSetAnimation", "openSetAnimation");
            cell.classList.add("closedSetCell");
        }

        drawSvgPath(path);

        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].x != end.x || openSet[i].y != end.y) {
                let cell = document.getElementById('container').children.item(openSet[i].x + openSet[i].y * c);
                cell.classList.remove("closedSetCell", "pathCell", "closedSetAnimation", "openSetAnimation");
                cell.classList.add("openSetCell");
            }
        }
    }

}


function drawSvgPath(path) {
    let pathElement = document.getElementById('svgPath');
    pathElement.classList.remove("animatePath");
    var svgPath = "";
    var cellWidth = document.getElementById('container').getBoundingClientRect().width / c;
    var cellHeight = document.getElementById('container').getBoundingClientRect().height / r;
    for (let i = 0; i < path.length - 1; i++) {
        svgPath += "M ";
        svgPath += (path[i].x * cellWidth + cellWidth / 2);
        svgPath += " " + (path[i].y * cellHeight + cellHeight / 2);
        svgPath += " L ";
        svgPath += (path[i + 1].x * cellWidth + cellWidth / 2);
        svgPath += " " + (path[i + 1].y * cellHeight + cellHeight / 2);
    }
    
    pathElement.setAttribute("d", svgPath);

}



function calculatePath(source) {
    document.getElementById("svgPath").setAttribute("d", ""); // to delete the previous path that was drawn
    resetClasses();
    setRecalculation();
    pathVisible = true;
    if (pathVisible && !animating) {
        var t0 = performance.now(); // TO MEASURE TIME TAKEN TO FIND THE PATH
        for (let i = 0; i < c; i++) { // SETS THE NEIGHBORS FOR EACH CELL 
            for (let j = 0; j < r; j++) {
                grid[i][j].addNeighbors();
            }
        }

        if((algorithmType=="A*" || algorithmType=="BTS") && heuristicType==undefined) {
            document.getElementById("errorDiv").style.visibility = "visible";
            document.getElementById("errorParagraph").innerHTML = "Pick a heuristic!";
            return;
        }

        //DETERMINE WHAT ALGORTHM TO USE
        else if (algorithmType == "A*" && heuristicType!=undefined) {
            path = aStar();
        } else if (algorithmType == "BFS") {
            path = BFS();
        } else if (algorithmType == "BTS" && heuristicType != undefined) {
            path = BTS();
        } else if (algorithmType == "dijkstra") {
            
            path = dijkstra();
        } else if(algorithmType==undefined) {
            document.getElementById("errorDiv").style.visibility = "visible";
            document.getElementById("errorParagraph").innerHTML = "Pick an algorithm!";
            pathVisible=false;
            return;
        }

        var t1 = performance.now(); // TO MEASURE TIME TAKEN TO FIND THE PATH
        document.getElementById("executionTimeParagraph").innerHTML = "Execution time: " + (t1 - t0).toFixed(3) + " ms.";

        //DISPLAY PATH LENGTH
        if (path.length == 0) {
            document.getElementById("pathLengthParagraph").innerHTML = "No path found";
            path = [];
        } else {
            pathLength = 0;
            for(i=0; i < path.length-1; i++) {
                pathLength += heuristic(path[i], path[i+1], 'euclidean');
            }
            document.getElementById("pathLengthParagraph").innerHTML = "Path length: " + pathLength.toFixed(2);
            drawPath(path, source, algorithmType);
        }
        

    }
}




function clearAll() {
    setRecalculation();
    for(let i = 0; i < c; i++) {
        for(let j = 0; j < r; j++) {
            let cell = document.getElementById('container').children.item(i + j*c);
            cell.classList.remove("wall", "closedSetCell", "closedSetAnimation", "pathCell", "openSetCell", "openSetAnimation");
            grid[i][j].isWall = false;
            grid[i][j].visited = false;
        }
    }
    document.getElementById("svgPath").setAttribute("d", "");
    pathVisible = false;
}