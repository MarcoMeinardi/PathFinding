const dy = [0, 1, 0, -1, 1, 1, -1, -1];
const dx = [1, 0, -1, 0, 1, -1, -1, 1];

const between = [NaN, NaN, NaN, NaN, [0, 1], [1, 2], [2, 3], [3, 0]];

async function A_star () {
	let open = [start];
	start.g = 0;
	start.f = h (start, goal);

	while (open.length != 0) {
		let curr = open[0];
		let curr_ind = 0;
		for (let i = 1; i < open.length; i++) {
			if (open[i].f < curr.f) {
				curr = open[i];
				curr_ind = i;
			}
		}
		if (curr.is_goal) {
			return reconstruct_path (goal);
		}

		open.splice (curr_ind, 1);
		curr.is_closed = true;
		if (!curr.is_start && !curr.is_goal && !curr.is_wall) {
			curr.cell.classList = "cell close";
			curr.animate();
			await new Promise (r => setTimeout (r, 0));
		}

		for (let i = 0; i < 8; i++) {
			let ny = curr.y + dy[i], nx = curr.x + dx[i];
			if (is_valid (ny, nx, curr, i)) {
				let neig = grid[ny][nx];
				let tent_g = curr.g + h(curr, neig);

				if (tent_g < neig.g) {
					neig.prev = curr;
					neig.g = tent_g;
					neig.f = neig.g + h(neig, goal);
					if (!open.includes (neig)) {
						open.push (neig);	
						if (!neig.is_start && !neig.is_goal && !neig.is_wall) {
							neig.cell.classList = "cell open";
							neig.animate();
							await new Promise (r => setTimeout (r, 0));
						}
					}
				}
			}
		}
	}
	return false;
}

async function dijkstra () {
	let open = [start];
	start.g = 0;

	while (open.length != 0) {
		let curr = open[0];
		let curr_ind = 0;
		for (let i = 1; i < open.length; i++) {
			if (open[i].g < curr.g) {
				curr = open[i];
				curr_ind = i;
			}
		}
		if (curr.is_goal) {
			return reconstruct_path (goal);
		}

		open.splice (curr_ind, 1);
		curr.is_closed = true;

		if (!curr.is_start && !curr.is_goal && !curr.is_wall) {
			curr.cell.classList = "cell close";
			curr.animate();
			await new Promise (r => setTimeout (r, 0));
		}


		for (let i = 0; i < 8; i++) {
			let ny = curr.y + dy[i], nx = curr.x + dx[i];
			if (is_valid (ny, nx, curr, i)) {
				let neig = grid[ny][nx];
				if (!open.includes (neig)) {
					open.push (neig);	
					if (!neig.is_start && !neig.is_goal && !neig.is_wall) {
						neig.cell.classList = "cell open";
						neig.animate();
						await new Promise (r => setTimeout (r, 0));
					}
				}
				let tent_g = curr.g + h(curr, neig);
				if (tent_g < neig.g) {
					neig.g = tent_g;
					neig.prev = curr;
				}
			}
		}
	}
	return false;
}



function h (a, b) {
	return Math.sqrt (Math.pow (a.y - b.y, 2) + Math.pow (a.x - b.x, 2));
}

function is_valid (y, x, prev, neig_ind) {
	if (y < 0 || x < 0 || y >= rows || x >= cols || grid[y][x].is_wall || grid[y][x].is_closed) {
		return false;
	}
	if (neig_ind < 4) {
		return true;
	}
	let py = prev.y, px = prev.x;
	adj = between[neig_ind];
	if (grid[py + dy[adj[0]]][px + dx[adj[0]]].is_wall && grid[py + dy[adj[1]]][px + dx[adj[1]]].is_wall) {
		return false;
	} else {
		return true;
	}
}

function reconstruct_path (node) {
	while (node) {
		path.push (node);
		node = node.prev;
	}

	for (let i = path.length - 2; i >= 0; i--) {
		let line = document.createElement ("div");
		line.classList.add ("path");
		line.setAttribute ("style", "\
			width:" + (path[i + 1].y == path[i].y || path[i + 1].x == path[i].x ? 30 : 42) + "px;\
			left:" + (path[i + 1].x * 30 + 15) + "px;\
			top:" + (path[i + 1].y * 30 + 15) + "px;\
			transform: rotate(" + get_rotation (path[i + 1], path[i]) + "deg);\
		");
		path_el.appendChild (line);
	}
	searching = false;
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			grid[y][x].g = Infinity;
			grid[y][x].f = Infinity;
			grid[y][x].is_closed = false;
		}
	}
	return true;
}

function get_rotation (a, b) {
	let y = a.y - b.y, x = a.x - b.x;
	if (y == 1) {
		if (x == 1) {
			return -135;
		} else if (x == 0) {
			return -90;
		} else {
			return -45;
		}
	} 
	if (y == 0) {
		if (x == 1) {
			return 180;
		} else {
			return 0;
		}
	} 
	if (y == -1) {
		if (x == 1) {
			return 135;
		} else if (x == 0) {
			return 90;
		} else {
			return 45;
		}
	}
}