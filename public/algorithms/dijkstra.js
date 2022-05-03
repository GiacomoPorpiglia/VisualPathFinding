import { animationSpeed } from "../calculatePath.js";
import { showAnimatedCells } from "./showAnimatedCells.js";
import { heuristic } from "../heuristic.js";
import { drawPath } from "../calculatePath.js";

export const dijkstra = () => {

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




export const drawDijkstraAnimating = () => {
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

