class Thing {

	constructor(index, x, y, world) {
		this.index = index;
		this.myWorld = world;
		this.position = createVector(x, y);
		this.velocity = createVector();
		this.acceleration = createVector();
		this.target = createVector();
		this.color = color(random(255), random(255), random(255));
		this.health = 200;
		this.r = 5;
		this.maxSpeed = Math.round(random(2, 20));
		this.maxForce = 0.8;
	}

	behaviors() {
		let steerFood = this.eat();
		//let steerOthers = this.align();
		let steerAway = this.separate();

		steerAway.mult(2);

		this.applyForce(steerFood);
		//this.applyForce(steerOthers);
		this.applyForce(steerAway);
	}

	update() {
		if (this.health <= 0 || this.health > 500) {
			this.die();
		}
		this.health -= this.myWorld.healthLostPerTick;
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		this.position.add(this.velocity);
		this.acceleration.mult(0);
	}

	eat() {
		let closestFood = null;
		let distMin = Infinity;
		let self = this;
		this.myWorld.food.forEach(function(food, i) {
			let desired = p5.Vector.sub(food, self.position);
			let dist = desired.mag();
			if (dist < 6) {
				self.myWorld.food.splice(i, 1);
				self.health += self.myWorld.foodEnergy;
			} else {
				if (dist < distMin) {
					distMin = dist;
					closestFood = food;
				}
			}
		});
		if (closestFood) {
			this.target = closestFood;
			return this.seek(closestFood);
		} else {
			this.target = createVector(0, 0);
			return createVector(0, 0);
		}
	}

	arrive() {
		let desired = p5.Vector.sub(this.myWorld.food, this.position);
		let dist = desired.mag();
		let speed = this.maxSpeed;
		let distmin = 5;
		if (dist < distmin) {
			speed = map(dist, 0, distmin, 0, this.maxSpeed);
		}
		desired.setMag(speed);
		let steer = p5.Vector.sub(desired, this.velocity);
		steer.limit(this.maxForce);
		return steer;
	}

	separate() {
		let sum = createVector();
		let count = 0;
		for (let i in this.myWorld.getThings()) {
			let thing = this.myWorld.getThings()[i];
			let d = p5.Vector.dist(this.position, thing.position);
			if (d > 0 && d < 50) {
				let diff = p5.Vector.sub(this.position, thing.position);
				diff.normalize();
				sum.add(diff);
				count++;
			}
		}
		if (count > 0) {
			sum.div(count);
			sum.normalize();
			sum.mult(this.maxSpeed);
			let steer = p5.Vector.sub(sum, this.velocity);
			steer.limit(this.maxForce);
			return steer;
		} else {
			return createVector(0, 0);
		}
	}

	align() {
		let sum = createVector();
		let count = 0;
		for (let i in this.myWorld.getThings()) {
			let thing = this.myWorld.getThings()[i];
			let d = p5.Vector.dist(this.position, thing.position);
			if (d > 0 && d < 50) {
				sum.add(thing.velocity);
				count++;
			}
		}
		if (count > 0) {
			sum.div(count);
			sum.mag(this.maxSpeed);
			let steer = p5.Vector.sub(sum, this.velocity);
			steer.limit(this.maxForce);
			return steer;
		} else {
			return createVector(0, 0);
		}
	}

	seek(target) {
		let desired = p5.Vector.sub(target, this.position);
		desired.setMag(this.maxSpeed);
		let steer = p5.Vector.sub(desired, this.velocity);
		steer.limit(this.maxForce);
		return steer;
	}

	applyForce(f) {
		this.acceleration.add(f);
	}

	die() {
		this.myWorld.removeThing(this);
		this.myWorld.addFood(this.position.x, this.position.y);
	}

	display() {
		let angle = this.velocity.heading() + Math.PI / 2;
		//show target
		fill(this.color);
		stroke(this.color);
		strokeWeight(1);
		push();
		translate(this.position.x, this.position.y);
		rotate(angle);
		beginShape();
		vertex(0, -this.r * 2);
		vertex(-this.r, this.r * 2);
		vertex(this.r, this.r * 2);
		endShape(CLOSE);
		noFill();

		ellipse(0, 0, this.health  < 200 ? this.health/2 : 100);
		pop();

	}
}
