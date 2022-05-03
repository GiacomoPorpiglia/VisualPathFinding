var rows = 21;
var cols = 41;
var grabbed = null;

var pathVisible = false;

var path = [];

var startX = 0, startY = 0, endX = cols-1, endY = rows-1;

var openSet = new Array();
var closedSet = new Array();

var GRID = new Array(cols);