import { clearWalls } from "./onload.js"
import { reset } from "./calculatePath.js"
export const generateMaze = () => {
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


export const removewall = (cell1, cell2) => {
    let xNeighbor = (cell1.x + cell2.x) / 2;
    let yNeighbor = (cell1.y + cell2.y) / 2;
    let cell = document.querySelector('.grid').childNodes[xNeighbor + yNeighbor * cols + 1];
    cell.classList.remove("wall");
    GRID[xNeighbor][yNeighbor].isWall = false;
}
