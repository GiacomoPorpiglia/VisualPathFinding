var animationSpeed = 1; // milliseconds


function drawAstarAnimating(heuristicType) {
    if (!animating) return;
    var tentativeIsBetter = false;

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
                drawSvgPath(path);
                animating = false;
                return null;
            }
            removeFrom(current, openSet);
            closedSet.push(current);

            var neighbors = current.neighbors;
            for (let i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];
                if (!includes(neighbor, closedSet) && !neighbor.isWall) {
                    var tentativeG = current.g + heuristic(current, neighbor, 'euclidean');;
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
            animating = false;
            return null;
        }
    }, animationSpeed)

}


//--------------------------------------------------------------------------------------------------
//-----------------BFS------------------------------
function drawBFSAnimating() {
    if (!animating) return;

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
                drawSvgPath(path);
                animating = false;
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
            drawBFSAnimating();
        } else {
            showAnimatedCells();
            animating = false;
            return null;
        }
    }, animationSpeed)
}


//---------------------------------------------------------------------------------------------------------4
//-------------------------------BTS--------------------------

function drawBTSAnimating(heuristicType) {
    if (!animating) return;
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
                drawSvgPath(path);
                animating = false;
                return null;
            }

            removeFrom(current, openSet);
            closedSet.push(current);

            var neighbors = current.neighbors;
            for (let i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];
                if (!includes(neighbor, closedSet) && !includes(neighbor, openSet) && !neighbor.isWall) {
                    openSet.push(neighbor);
                    neighbor.h = heuristic(neighbor, end, heuristicType);
                    neighbor.f = neighbor.h;
                    neighbor.previous = current;
                }
            }
            drawBTSAnimating(heuristicType);
        } else {
            showAnimatedCells();
            animating = false;
            return null;
        }
    }, animationSpeed)
}

//--------------------------------------------------------------------------


function drawDijkstraAnimating() {
    if (!animating) return;

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
                drawSvgPath(path);
                animating = false;
                return null;
            }


            var neighbors = current.neighbors;
            for (let i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];
                if (!includes(neighbor, closedSet) && !neighbor.isWall) {

                    let tentativeF = current.f + heuristic(current, neighbor, "euclidean");
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
            animating = false;
            return null;
        }
    }, animationSpeed)
}






function showAnimatedCells() {
    for (let i = 1; i < closedSet.length; i++) {
        let cell = document.getElementById('container').children.item(closedSet[i].x + closedSet[i].y * c);
        cell.classList.remove("pathCell", "openSetCell", "openSetAnimation");
        cell.classList.add("closedSetCell", "closedSetAnimation");
    }

    // for (let i = 1; i < path.length - 1; i++) {
    //     let cell = document.getElementById('container').children.item(path[i].x + path[i].y * c);
    //     cell.classList.remove("closedSetCell", "openSetCell");
    //     cell.classList.add("pathCell");
    // }
    //drawSvgPath(path);

    for (let i = 0; i < openSet.length; i++) {
        if ((openSet[i].x != end.x || openSet[i].y != end.y) && (openSet[i].x != start.x || openSet[i].y != start.y)) {
            let cell = document.getElementById('container').children.item(openSet[i].x + openSet[i].y * c);
            if(!cell.classList.contains("openSetCell")) {
                cell.classList.remove("closedSetCell", "closedSetAnimatoin", "pathCell");
                cell.classList.add("openSetCell", "openSetAnimation");
            }
        }
    }
}


// function showPathAnimating(i) {
//     setTimeout(function () {
//         let cell = document.getElementById('container').children.item(path[i].x + path[i].y * c);
//         cell.classList.remove("closedSetCell", "openSetCell");
//         cell.classList.add("pathCell");
//         if(++i < path.length-1) 
//             showPathAnimating(i);
//     }, 1)
// }


