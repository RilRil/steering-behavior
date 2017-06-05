class World {
	constructor(width, height) {
		this.foodEnergy = 20;
		this.healthLostPerTick = 0.5;
		this.width = width || 500;
		this.height = height || 500;
		this.things = {};
		this.numberOfThings = 0;
		this.food = [];
		console.log('Creating the world', this.width, this.height);
	}

	show() {
		stroke(255, 255, 10);
		strokeWeight(8);
		this.food.forEach(function(food) {
			point(food.x, food.y);
		});

		noStroke();
		let y = 20;
		for (let index in this.things) {
			let thing = this.things[index];
			fill(thing.color);
			text(thing.index + '(' + thing.maxSpeed + ') : ' + Math.floor(thing.health), 5, y);
			y += 20;
		}
	}

	addFood(x, y) {
		this.food.push(createVector(
			x || random(20, this.width - 20),
			y || random(20, this.height - 20)));
	}

	removeThing(thing) {
		delete this.things[thing.index];
	}

	addThing(x, y) {
		this.numberOfThings++;
		this.things[this.numberOfThings] = new Thing(
			this.numberOfThings,
			x || random(10, this.width - 10),
			y || random(10, this.height - 10),
			this
		);
	}

	getThings() {
		return this.things;
	}
}
