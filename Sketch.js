var rows = 36, cols = 64;

var grid_el;
var grid;
var path_el;

var set_start, set_goal, set_walls;
var start, goal;
var path;


var already_clicked;
var placing;
var searching;

function init() {
	grid_el = document.querySelector (".grid");
	path_el = document.querySelector (".path-container");
	grid_el.innerHTML = "";
	path_el.innerHTML = "";
	grid = [];
	path = [];
	for (let y = 0; y < rows; y++) {
		grid.push ([]);
		for (let x = 0; x < cols; x++) {
			let node = new Node (y, x);
			grid_el.appendChild (node.cell);
			grid[y].push (node);
		}
	}

	set_start = true;
	set_goal  = true;
	set_walls = false;
	start = undefined;
	goal  = undefined;
	searching = false;
}
init();

document.addEventListener ("mousedown", function (e) {
	if (!searching) {
		clear_search();
		let y = Math.floor (e.pageY / 30), x = Math.floor (e.pageX / 30);
		grid[y][x].click_cell();
		e.preventDefault();
	}
});

document.addEventListener ("mousemove", function (e) {
	if (!searching) {
		if (set_walls) {
			let y = Math.floor (e.pageY / 30), x = Math.floor (e.pageX / 30);
			grid[y][x].place_wall();
		}
	}
});

document.addEventListener ("mouseup", function () {
	if (!searching) {
		set_walls = false;
	}
});

document.addEventListener ("keydown", async function (e) {
	if (!set_start && !set_goal && e.keyCode == 13 && !searching) {
		searching = true
		path = [];
		clear_search();
		await new Promise (r => setTimeout (r, 100));
		A_star();
		//dijkstra();
	} else if (e.keyCode == 114 || e.keyCode == 82) {
		init();
	}
});

function clear_search () {
	path_el.innerHTML = "";
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			if (!grid[y][x].is_start && !grid[y][x].is_goal && !grid[y][x].is_wall) {
				grid[y][x].cell.classList = "cell";
			}
		}
	}
}