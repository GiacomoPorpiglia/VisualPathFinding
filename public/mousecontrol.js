import { calculatePath } from "./calculatePath.js";

export const controlMouseDown = (e) => {
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


export const controlMouseMove = (e) => {
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
                playSound('/public/wallSound.mp3') 
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

