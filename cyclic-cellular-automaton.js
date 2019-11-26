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

	setRandomState(context)
	CCARender(context);
	return context;
}

function CCARender(context) {
	var rowsCount = context.rowsCount;
	var colsCount = context.colsCount;
	var resolution = context.resolution;
	var ctx = context.ctx;
	var state = context.state;

	for (let x = 0; x < colsCount; x++) {
		for (let y = 0; y < rowsCount; y++) {
			fillSquare(ctx, state[x][y], x * resolution, y * resolution, resolution);
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
	var rowsCount = context.rowsCount;
	var colsCount = context.colsCount;
	var state = context.state;

	for (let x = 0; x < colsCount; x++) {
		for (let y = 0; y < rowsCount; y++) {
			state[x][y] = CCACellTransformation(context, x, y)
		}
	}
}

function CCAStop() {
	clearInterval(CCARenderInterval);
}

function CCACellTransformation(context, x, y) {
	var state = context.state;

	var threshold = 5;
	var neighbours = [
		cyclicStateEl(context, x-1, y-1),
		cyclicStateEl(context,  x, 	y-1),
		cyclicStateEl(context, x+1, y-1),

		cyclicStateEl(context, x-1, y),
		cyclicStateEl(context, x+1, y),

		cyclicStateEl(context, x-1, y+1),
		cyclicStateEl(context,  x,  y+1),
		cyclicStateEl(context, x+1, y+1),
	]

	var thisCell = state[x][y];
	var successorNeighbours = neighbours.filter(function (neighbour) { return neighbour.id > thisCell.id })
	var randomSuccessorNeighbours = successorNeighbours[Math.floor(Math.random() * successorNeighbours.length)];
	var newCell = successorNeighbours.length >= threshold ? randomSuccessorNeighbours : thisCell;

	return newCell;
}

function cyclicStateEl (context, x, y) {
	var state = context.state;
	var colsCount = context.colsCount;
	var rowsCount = context.rowsCount;

	x = (x === -1) ? colsCount - 1 : x;
	x = (x === colsCount) ? 0 : x;

	y = (y === -1) ? rowsCount - 1 : y;
	y = (y === rowsCount) ? 0 : y;

	return state[x][y];
}

function setRandomState(context) {
	var state = context.state;
	var colsCount = context.colsCount;
	var rowsCount = context.rowsCount;
	var availableColors = context.availableColors;

	for (let x = 0; x < colsCount; x++) {
		for (let y = 0; y < rowsCount; y++) {
			if (!state[x]) state[x] = [];
			var randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
			state[x][y] = randomColor;
		}
	}
}

function pickColors(amount) {
	var colors = [];
	for (let i = 0; i < amount; i++) {
		var color = hexToRgb(availableColors[i])
		color.id = i
		colors.push(color);
	}
	return colors;
}

function fillSquare(ctx, pixelRgb, x, y, resolution) {
	ctx.fillStyle = "rgb(" + pixelRgb.r + "," + pixelRgb.g + "," + pixelRgb.b + ")";
	ctx.fillRect(x, y, resolution, resolution);
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