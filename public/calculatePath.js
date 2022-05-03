import {heuristic} from "./heuristic.js"
import {astar, drawAstarAnimating} from "./algorithms/astar.js"
import {dijkstra, drawDijkstraAnimating} from "./algorithms/dijkstra.js"
import {breadthfisrt, drawBreadthAnimating} from "./algorithms/breadthfirst.js"
import { handleSelectHeuristicError, handleSelectAlgorithmError } from "./errorHandling.js"
var start, end;
export const animationSpeed = 3;
export const calculatePath = (animating) => {

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


export const reset = () => {
    
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

export const drawPath = (path) => {
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