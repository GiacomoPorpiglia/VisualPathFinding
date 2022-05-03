export const heuristic = (from, to, type) => {
    let dx = Math.abs(from.x-to.x);
    let dy = Math.abs(from.y-to.y);
    if(type=="euclidean")
        var d = Math.sqrt(dx*dx + dy*dy); //EUCLIDEAN
    else if(type=="manhattan")
        var d = dx + dy; //MANHATTAN
    else if(type == "octile") {
        if (dx > dy) d = (1 * (dx - dy) + 1.414 * dy);
        else d = (1 * (dy - dx) + 1.414 * dx);
    }
    return d;
};