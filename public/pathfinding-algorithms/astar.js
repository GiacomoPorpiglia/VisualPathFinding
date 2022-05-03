var grid = new Array(c);
for (let i = 0; i < c; i++) {
    grid[i] = new Array(r);
}
for (let i = 0; i < c; i++) {
    for (let j = 0; j < r; j++) {
        grid[i][j] = new Cell(i, j);
    }
}
// for (let i = 0; i < c; i++) {
//     for (let j = 0; j < r; j++) {
//         grid[i][j].addNeighbors();
//     }
// }

var openSet = new Array();
var closedSet = new Array();

var startx = 0;
var starty = 0;
var endx = c - 1;
var endy = r - 1;
var start = grid[startx][starty]; // = grid[startx][starty];
var end = grid[endx][endy]; // = grid[endx][endy];
var path = [];

//---------------------------------------------------------------------

function aStar() {
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




