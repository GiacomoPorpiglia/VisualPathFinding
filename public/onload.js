import {controlMouseDown, controlMouseMove} from "./mousecontrol.js";
import {generateMaze} from "./generateMaze.js"
import {calculatePath} from "./calculatePath.js"

window.onload = function() {
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

export const clearWalls = () => {
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