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
	CCARenderInterval = setInterval(function () {
		if (++i === maxIterations) clearInterval(CCARenderInterval);
		CCALoopCells(context);
		CCARender(context);
	}, 50);
}

function CCALoopCells(context) {
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
		getCellColorId(context, x - 1, y - 1),
		getCellColorId(context, x, y - 1),
		getCellColorId(context, x + 1, y - 1),

		getCellColorId(context, x - 1, y),
		getCellColorId(context, x + 1, y),

		getCellColorId(context, x - 1, y + 1),
		getCellColorId(context, x, y + 1),
		getCellColorId(context, x + 1, y + 1),
	]

	let thisCell = state[y][x];
	let nextColorId = nextCellColorId(thisCell, context.colors);
	let successorNeighboursCount = neighbours.filter(function (neighbour) { return neighbour.id == nextColorId })

	let newCell = (successorNeighboursCount.length >= threshold) ? successorNeighboursCount[0] : thisCell;

	return newCell;
}

function getCellColorId(context, x, y) {
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

function fillSquare(ctx, colorRgb, x, y, resolution) {
	ctx.fillStyle = "rgb(" + colorRgb[0] + "," + colorRgb[1] + "," + colorRgb[2] + ")";
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

function nextCellColorId(cell, colors) {
	let cellId = cell.id;
	if (cellId >= (colors.length - 1)) {
		return 0;
	}
	return cellId + 1;
}

function pickColors(numberOfColors) {

	let minRandomColor = chroma.random();
	let maxRandomColor = chroma.random();

	let colors = chroma.scale([minRandomColor, maxRandomColor]).padding(0.05).colors(numberOfColors);

	let rgbColorsWithId = [];
	for (let i = 0; i < colors.length; i++) {
		let rgbColor = chroma(colors[i]).rgb()
		rgbColor.id = i
		rgbColorsWithId.push(rgbColor);
	}
	return rgbColorsWithId;
}
