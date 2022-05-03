//BEST FIRST SEARCH
function BTS() {
    start.h = heuristic(start, end, heuristicType);
    start.f = start.h;
    openSet.push(start);
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
            if (!includes(neighbor, closedSet) && !includes(neighbor, openSet) && !neighbor.isWall) {
                openSet.push(neighbor);

                neighbor.h = heuristic(neighbor, end, heuristicType);
                neighbor.f = neighbor.h;
                neighbor.previous = current;
            }
        }
    }
    return [];
}


