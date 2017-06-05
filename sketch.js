const canvasW = 600;
const canvasH = 600;

let cbFrameRate = null;
let world = null;

let wallPosition = [];

let positionWallStart = null;
let positionWallEnd = null;

function setup() {
	createCanvas(canvasW, canvasH);
	cbFrameRate = createCheckbox('Frame Rate', false);
	cbFrameRate.changed(function() {
		console.log('cyril -- coucou');
	});

	world = new World(canvasW, canvasH);
	for (let i = 0; i < 50; i++) {
		world.addFood();
	}
	for (let i = 0; i < 5; i++) {
		world.addThing();
	}
}

function draw() {
	background(51);
	if (cbFrameRate.checked()) {
		fill(255);
		noStroke();
		text(Math.round(frameRate()), 10, canvasH - 20);
	}

	if (random(1) < 0.05) {
		world.addFood()
	}

	world.show();
	for (let index in world.getThings()) {
		let thing = world.getThings()[index];
		thing.behaviors();
		thing.update();
		thing.display();
	}

	// stroke(255);
	// strokeWeight(10);
	// for (var i =0; i < wallPosition.length; i++) {
	// 	line(wallPosition[i].start.x,
	// 		wallPosition[i].start.y,
	// 		wallPosition[i].end.x,
	// 		wallPosition[i].end.y);
	// }
	//
	// if (mouseIsPressed) {
	// 	line(positionWallStart.x, positionWallStart.y, mouseX, mouseY);
	// }
}

function mousePressed() {
	world.addThing(mouseX, mouseY);

	//	positionWallStart = {
	//		x: mouseX,
	//		y: mouseY
	//	};
}

function mouseReleased() {
	positionWallEnd = {
		x: mouseX,
		y: mouseY
	};
	if (positionWallStart) {
		wallPosition.push({
			start: positionWallStart,
			end: positionWallEnd
		});
	}
}
