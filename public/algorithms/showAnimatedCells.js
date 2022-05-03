export const showAnimatedCells = () => {
    for (let i = 1; i < closedSet.length; i++) {
        let cell = document.querySelector('.grid').childNodes[closedSet[i].x + closedSet[i].y * cols +1];
        cell.classList.remove("pathCell", "openSet", "openSetAnimation");
        cell.classList.add("closedSet", "closedSetAnimation");
    }

    for (let i = 0; i < openSet.length; i++) {
        if ((openSet[i].x != endX || openSet[i].y != endY) && (openSet[i].x != startX || openSet[i].y != startY)) {
            let cell = document.querySelector('.grid').childNodes[openSet[i].x + openSet[i].y * cols +1];
            if(!cell.classList.contains("openSet")) {
                cell.classList.remove("closedSet", "closedSetAnimatoin", "pathCell");
                cell.classList.add("openSet", "openSetAnimation");
            }
        }
    }
}