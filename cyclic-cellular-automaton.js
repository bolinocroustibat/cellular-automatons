var allColors = [
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

function CCACreateContext(options) {

	clearInterval(CCARenderInterval);

	let canvasEl = options.canvasEl;
	let numberOfColors = options.numberOfColors;
	let threshold = options.threshold;
	let width = options.width;
	let height = options.height;
	let resolution = options.resolution;

	let rowsCount = height / resolution;
	let colsCount = width / resolution;

	let state = [];
	let colors = pickColors(numberOfColors);
	let ctx = setupCanvas(canvasEl, width, height);

	let context = {
		state: state,
		colors: colors,
		threshold: threshold,
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
	let rowsCount = context.rowsCount;
	let colsCount = context.colsCount;
	let resolution = context.resolution;
	let ctx = context.ctx;
	let state = context.state;

	for (let y = 0; y < rowsCount; y++) {
		for (let x = 0; x < colsCount; x++) {
			fillSquare(ctx, state[y][x], x * resolution, y * resolution, resolution);
		}
	}
}

function CCAStart(context, maxIterations = 500) {
	let i = 0;
	CCARenderInterval = setInterval(function() {
		if (++i === maxIterations) clearInterval(CCARenderInterval);
		CCALoopStep(context, i);
		CCARender(context);
	}, 50);
}

function CCALoopStep(context, iteration) {
	let rowsCount = context.rowsCount;
	let colsCount = context.colsCount;
	let state = context.state;

	for (let y = 0; y < rowsCount; y++) {
		for (let x = 0; x < colsCount; x++) {
			state[y][x] = CCACellTransformation(context, x, y)
		}
	}
}

function CCACellTransformation(context, x, y) {

	let state = context.state;

	let threshold = context.threshold;

	let neighbours = [
		cyclicStateEl(context, x-1, y-1),
		cyclicStateEl(context,  x,  y-1),
		cyclicStateEl(context, x+1, y-1),

		cyclicStateEl(context, x-1, y),
		cyclicStateEl(context, x+1, y),

		cyclicStateEl(context, x-1, y+1),
		cyclicStateEl(context,  x,  y+1),
		cyclicStateEl(context, x+1, y+1),
	]

	let thisCell = state[y][x];
	let nextColorId = nextCellColorId(thisCell, context.colors);
	let plusOneSuccessorNeighbours = neighbours.filter(function (neighbour) { return neighbour.id == nextColorId })

	let newCell = (plusOneSuccessorNeighbours.length >= threshold) ? plusOneSuccessorNeighbours[0] : thisCell;

	return newCell;
}

function cyclicStateEl(context, x, y) {
	var state = context.state;
	let colsCount = context.colsCount;
	let rowsCount = context.rowsCount;

	x = (x === -1) ? colsCount - 1 : x;
	x = (x === colsCount) ? 0 : x;

	y = (y === -1) ? rowsCount - 1 : y;
	y = (y === rowsCount) ? 0 : y;

	return state[y][x];
}

function setRandomState(context) {
	let state = context.state;
	let colsCount = context.colsCount;
	let rowsCount = context.rowsCount;
	let colors = context.colors;

	for (let y = 0; y < rowsCount; y++) {
		for (let x = 0; x < colsCount; x++) {
			if (!state[y]) state[y] = [];
			var randomColor = colors[Math.floor(Math.random() * colors.length)];
			state[y][x] = randomColor;
		}
	}
}

function pickColors(amount) {
	let colors = [];
	for (let i = 0; i < amount; i++) {
		let color = hexToRgb(allColors[i])
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

function nextCellColorId(cell, colors) {
	let cellId = cell.id;
	if (cellId >= (colors.length - 1)) {
		return 0;
	}
	return cellId + 1;
}