var CCA2DrenderInterval;

function CCA2DcreateContext(settings) {

	clearInterval(CCA2DrenderInterval);

	let canvasEl = settings.canvasEl;
	let colorsCount = settings.cca2dColorsCount;
	let threshold = settings.cca2dThreshold;
	let resolution = settings.cca2dResolution;
	let width = settings.width - (settings.width % resolution);
	let height = settings.height - (settings.height % resolution);
	let rowsCount = height / resolution;
	let colsCount = width / resolution;

	let state = [];
	let colors = pickColors(colorsCount);
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

	CCA2DsetRandomState(context)
	CCA2Drender(context);
	return context;
}

function CCA2Drender(context) {
	let rowsCount = context.rowsCount;
	let colsCount = context.colsCount;
	let resolution = context.resolution;
	let ctx = context.ctx;
	let state = context.state;
	for (let y = 0; y < rowsCount; ++y) {
		for (let x = 0; x < colsCount; ++x) {
			fillSquare(ctx, state[y][x], x * resolution, y * resolution, resolution);
		}
	}
}

function CCA2Dstart(context, maxIterations = 1000) {
	if (context) {
		let i = 0;
		CCA2DrenderInterval = setInterval(function () {
			if (++i === maxIterations) clearInterval(CCA2DrenderInterval);
			let newState = CCASetNewState(context);
			context.state = newState;
			CCA2Drender(context);
		}, 1);
	}
}

function CCASetNewState(context) {
	let rowsCount = context.rowsCount;
	let colsCount = context.colsCount;
	let newState = [];
	for (let y = 0; y < rowsCount; ++y) {
		if (!newState[y]) newState[y] = [];
		for (let x = 0; x < colsCount; ++x) {
			newState[y][x] = CCACellTransformation(context, x, y)
		}
	}
	return newState;
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
	let state = context.state;
	let colsCount = context.colsCount;
	let rowsCount = context.rowsCount;

	x = (x === -1) ? colsCount - 1 : x;
	x = (x === colsCount) ? 0 : x;

	y = (y === -1) ? rowsCount - 1 : y;
	y = (y === rowsCount) ? 0 : y;

	return state[y][x];
}

function CCA2DsetRandomState(context) {
	let state = context.state;
	let colsCount = context.colsCount;
	let rowsCount = context.rowsCount;
	let colors = context.colors;

	for (let y = 0; y < rowsCount; ++y) {
		for (let x = 0; x < colsCount; ++x) {
			if (!state[y]) state[y] = [];
			let randomColor = colors[Math.floor(Math.random() * colors.length)];
			state[y][x] = randomColor;
		}
	}
}

function fillSquare(ctx, colorRgb, x, y, resolution) {
	ctx.fillStyle = "rgb(" + colorRgb[0] + "," + colorRgb[1] + "," + colorRgb[2] + ")";
	ctx.fillRect(x, y, resolution, resolution);
}
