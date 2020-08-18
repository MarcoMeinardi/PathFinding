class Node {
	constructor (y, x) {
		this.y = y;
		this.x = x;
		this.is_wall = false;
		this.is_start = false;
		this.is_goal = false;

		this.g = Infinity;
		this.f = Infinity;
		this.is_closed = false;

		this.cell = document.createElement ("div");
		this.cell.classList = "cell";
		this.cell.style.top = 30 * this.y + "px";
		this.cell.style.left = 30 * this.x + "px";
	}

	click_cell() {
		if (set_start) {
			if (this.is_goal) {
				this.cell.classList = "cell";
				this.is_goal = false;
				goal = undefined;
				set_goal = true;
			} else {
				start = grid[this.y][this.x];
				set_start = false;
				this.is_start = true;
				this.is_wall = false;
				this.cell.classList = "cell start";
				this.animate();
			}
		} else if (set_goal) {
			if (this.is_start) {
				this.cell.classList = "cell";
				this.is_start = false;
				start = undefined;
				set_start = true;
			} else {
				goal = grid[this.y][this.x];
				set_goal = false;
				this.is_goal = true;
				this.is_wall = false;
				this.cell.classList  ="cell goal";
				this.animate();
			}
		} else {
			if (this.is_start) {
				this.cell.classList = "cell";
				this.is_start = false;
				start = undefined;
				set_start = true;
			} else if (this.is_goal) {
				this.cell.classList = "cell";
				this.is_goal = false;
				goal = undefined;
				set_goal = true;
			} else {
				already_clicked = new Set();
				placing = !this.is_wall;
				set_walls = true;
				this.place_wall();
			}
		}
	}

	place_wall () {
		if (!this.is_start && !this.is_goal && !already_clicked.has (this)) {
			already_clicked.add (this);
			if (placing && !this.is_wall) {
				this.cell.classList = "cell wall";
				this.is_wall = true;
				this.animate();
			} else if (!placing && this.is_wall) {
				this.cell.classList = "cell";
				this.is_wall = false;
			}
		}
	}

	async animate () {
		this.cell.classList.add ("animate");
		await new Promise (r => setTimeout (r, 200));
		this.cell.classList.add ("deanimate");
		await new Promise (r => setTimeout (r, 200));
		this.cell.classList.remove ("animate");
		this.cell.classList.remove ("deanimate");
	}
}