//Randomized depth-first search
function mazeGenerator() {
    if(!animating) {
        clearAll();
        //MOVE START AND END TO [1][1] AND [C-2][R-2] 
        let prevStart = document.getElementById('container').children.item(startx + starty * c);
        prevStart.classList.remove("startCell");
        start = grid[1][1];
        startx = starty = 1;
        let cell = document.getElementById('container').children.item(start.x + start.y * c);
        cell.classList.add("startCell");

        let prevEnd = document.getElementById('container').children.item(endx + endy * c);
        prevEnd.classList.remove("endCell");
        end = grid[c-2][r-2];
        endx = c-2; endy = r-2;
        cell = document.getElementById('container').children.item(end.x + end.y * c);
        cell.classList.add("endCell");


        var current = start;
        current.visited = true;
        var stack = new Array();
        stack.push(current);
        for(let i = 0; i < r; i++) {
            for(let j = 0; j < c; j++) {
                if ((i == r - 1 || j == c - 1) || (i % 2 != 0 && j % 2 == 0) || (i%2==0)) {
                    // let cell = document.getElementById('container').children.item(j + i * c);
                    // cell.classList.add("wall");
                    grid[j][i].isWall = true;
                }
            }
        }
        while(stack.length > 0) {
            
            var currNeighbors = current.getMazeNeighbors();
            
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
        drawMaze(0, 0);
    }
}

function drawMaze(i, j) {         //  create a loop function
    setTimeout(function () {
        for(i = 0; i < c; i++) {
            if (grid[i][j].isWall) {
                let cell = document.getElementById('container').children.item(i + j * c);
                cell.classList.add("wall");
            }
        }
        j++;
        if (j < r) drawMaze(i, j);
        else animating = false;
    }, 200)
}

function removewall(cell1, cell2) {
    let xNeighbor = (cell1.x + cell2.x) / 2;
    let yNeighbor = (cell1.y + cell2.y) / 2;
    // let cell = document.getElementById('container').children.item(xNeighbor + yNeighbor * c);
    // cell.classList.remove("wall");
    grid[xNeighbor][yNeighbor].isWall = false;
}

        // let i = path.length-2;
        