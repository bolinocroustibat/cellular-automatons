var availableColors = [
	"#006400",
	"#ffff00",
	"#ff0000",
	"#00008b",
	"#ff8c00",
	"#ff00ff",
	"#ffd700",
	"#008000",
	"#4b0082",
	"#f0e68c",
	"#556b2f",
	"#add8e6",
	"#00ff00",
	"#bdb76b",
	"#800000",
	"#000080",
	"#808000",
	"#ffa500",
	"#ffc0cb",
	"#800080",
	"#c0c0c0",
	"#ffffff",
	"#e0ffff",
	"#90ee90",
	"#d3d3d3",
	"#ffb6c1",
	"#9932cc",
	"#8b0000",
	"#e9967a",
	"#0000ff",
	"#00ffff",
	"#f5f5dc",
	"#a52a2a",
	"#000000",
	"#008b8b",
	"#a9a9a9",
	"#f0ffff"
];

var CCARenderInterval;

function CCAApp(options) {
	let canvasEl = options.canvasEl
	let amountOfColors = options.amountOfColors
	let width = options.width
	let height = options.height
	let resolution = options.resolution

	let rowsCount = height / resolution;
	let colsCount = width / resolution;

	let state = [];
	let availableColors = pickColors(amountOfColors);
	let ctx = setupCanvas(canvasEl, width, height);

	// set initial state
	for (let y = 0; y < rowsCount; ++y) {
		for (let x = 0; x < colsCount; ++x) {
			if (!state[y]) state[y] = [];
			state[y][x] = CCARandomizeRGBColor(availableColors);
		}
	}

	var context = {
		state: state,
		availableColors: availableColors,
		width: width,
		height: height,
		resolution: resolution,
		rowsCount: rowsCount,
		colsCount: colsCount,
		ctx: ctx
	}

	CCARender(context);
	return context;
}

function CCARender(context) {
	var rowsCount = context.rowsCount;
	var colsCount = context.colsCount;
	var resolution = context.resolution;
	var ctx = context.ctx;
	var state = context.state;

	for (let y = 0; y < rowsCount; y++) {
		for (let x = 0; x < colsCount; x++) {
			fillSquare(ctx, state[y][x][1], x * resolution, y * resolution, resolution);
		}
	}
}

function CCAStart(context, maxIterations = 20) {
	CCAStop();
	var i = 0;
	CCARenderInterval = setInterval(function() {
		if (++i === maxIterations) CCAStop();
		CCALoopStep(context, i);
		CCARender(context);
	}, 200);
}

function CCALoopStep(context, iteration) {
	var state = context.state;

	// trivial demo state transformation example:
	state[0][iteration] = state[0][0];
}

function CCAStop() {
	clearInterval(CCARenderInterval);
}

function CCAChangestateColors(currentState, maxColor) {
	let nextState = [];
	let stateWidth = currentState[0].length;
	let stateHeight = currentState.length;
	rowLoop:
	for (let y = 0; y < stateHeight; ++y) {
		nextState[y] = [];
		ColumnLoop:
		for (let x = 0; x < stateWidth; ++x) {
			let adjacentPixelsColors = [];
			// Getting LEFT-TOP pixel color (0)
			if (currentState[y - 1] == undefined) { // extreme top
				if (currentState[stateHeight - 1][x - 1] == undefined) { // extreme left and extreme top
					adjacentPixelsColors[0] = currentState[stateHeight - 1][stateWidth - 1];
				}
				else { // extreme top only
					adjacentPixelsColors[0] = currentState[stateHeight - 1][x - 1];
				}
			}
			else if (currentState[y - 1][x - 1] == undefined) { // not extreme top but extreme left
				adjacentPixelsColors[0] = currentState[y - 1][stateWidth - 1];
			}
			else {
				adjacentPixelsColors[0] = currentState[y - 1][x - 1];
			}
			// Getting TOP pixel color (1)
			if (currentState[y - 1] == undefined) {
				adjacentPixelsColors[1] = currentState[stateHeight - 1][x];
			}
			else {
				adjacentPixelsColors[1] = currentState[y - 1][x];
			}
			// Getting RIGHT-TOP pixel color (2)
			if (currentState[y - 1] == undefined) { // extreme top
				if (currentState[stateHeight - 1][x + 1] == undefined) { // extreme right and extreme top
					adjacentPixelsColors[2] = currentState[stateHeight - 1][stateWidth - 1];
				}
				else { // extreme top only
					adjacentPixelsColors[2] = currentState[0][x + 1];
				}
			}
			else if (currentState[y - 1][x + 1] == undefined) { // not extreme top but extreme right
				adjacentPixelsColors[2] = currentState[y - 1][0];
			}
			else {
				adjacentPixelsColors[2] = currentState[y - 1][x + 1];
			}
			// Getting LEFT pixel color (3)
			if (currentState[y][x - 1] == undefined) {
				adjacentPixelsColors[3] = currentState[y][stateWidth - 1];
			}
			else {
				adjacentPixelsColors[3] = currentState[y][x - 1];
			}
			// Getting RIGHT pixel color (4)
			if (currentState[y][x + 1] == undefined) {
				adjacentPixelsColors[4] = currentState[y][0];
			}
			else {
				adjacentPixelsColors[4] = currentState[y][x + 1];
			}
			// Getting LEFT-DOWN pixel color (5)
			if (currentState[y + 1] == undefined) { // extreme down
				if (currentState[0][x - 1] == undefined) { // extreme down and extreme left
					adjacentPixelsColors[5] = currentState[0][stateWidth - 1];
				}
				else { // extreme down only
					adjacentPixelsColors[5] = currentState[0][x - 1];
				}
			}
			else if (currentState[y + 1][x - 1] == undefined) { // not extreme down but extreme left
				adjacentPixelsColors[5] = currentState[y + 1][stateWidth - 1];
			}
			else {
				adjacentPixelsColors[5] = currentState[y + 1][x - 1];
			}
			// Getting DOWN pixel color (6)
			if (currentState[y + 1] == undefined) {
				adjacentPixelsColors[6] = currentState[0][x];
			}
			else {
				adjacentPixelsColors[6] = currentState[y + 1][x];
			}
			// Getting RIGHT-DOWN pixel color (7)
			if (currentState[y + 1] == undefined) { // extreme down
				if (currentState[y + 1][x + 1] == undefined) { // extreme down and extreme right
					adjacentPixelsColors[7] = currentState[0][0];
				}
				else { // extreme down only
					adjacentPixelsColors[7] = currentState[0][x + 1];
				}
			}
			else if (currentState[y + 1][x + 1] == undefined) { // not extreme down but extreme right
				adjacentPixelsColors[7] = currentState[y + 1][0];
			}
			else {
				adjacentPixelsColors[7] = currentState[y + 1][x + 1];
			}
			let nextColor = currentState[y][x] + 1;
			if ((nextColor > maxColor) && (adjacentPixelsColors.includes(0))) { // if the color is already at maximum and there is the first color in adjacents, takes it
				nextState[y][x] = 0;
				continue ColumnLoop;
			}
			else {
				if (adjacentPixelsColors.includes(nextColor)) {
					// console.log("UPGRADE SQUARE COLOR TO " + nextColor);
					nextState[y][x] = nextColor;
					continue ColumnLoop;
				}
				else {
					// else, keep the current color
					// console.log("DO NOT CHANGE");
					nextState[y][x] = currentState[y][x];
				}
			}
		}
	}
	// console.log(nextState);
	return nextState;
}

function pickColors(amount) {
	var colors = [];
	for (let i = 0; i < amount; i++) {
		colors.push(hexToRgb(availableColors[i]));
	}
	return colors;
}

function fillSquare(ctx, pixelRgb, x, y, resolution) {
	ctx.fillStyle = "rgb(" + pixelRgb.r + "," + pixelRgb.g + "," + pixelRgb.b + ")";
	ctx.fillRect(x, y, resolution, resolution);
}

function CCARandomizeRGBColor(availableColors) {
	let n = Math.floor(Math.random() * availableColors.length);
	return [n, availableColors[n]];
}

function setupCanvas(canvasEl, width, height) {
	canvasEl.width = width;
	canvasEl.height = height;
	canvasEl.style.width = width + 'px';
	canvasEl.style.height = height + 'px';
	let ctx = canvasEl.getContext('2d');
	let img = new Image();
	ctx.drawImage(img, 0, 0);
	return ctx;
}

function hexToRgb(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (!result) return { r: undefined, g: undefined, b: undefined };

	return {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	};
}