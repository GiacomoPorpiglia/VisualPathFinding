//breadth first search
function BFS() {
    start.f = 0;
    openSet.push(start);
    while (openSet.length > 0) {
        var lowestIndex = 0;
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
    }
    return [];

}