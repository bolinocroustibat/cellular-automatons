var CCA1DrenderInterval;

function CCA1DcreateContext(options) {

	clearInterval(CCA1DrenderInterval);

	let canvasEl = options.canvasEl;
	let colorsCount = options.cca1dColorsCount;
	let width = options.width;
	let height = options.height;

	let state = [];
	let colors = pickColors(colorsCount);
	let ctx = setupCanvas(canvasEl, width, height);

	let context = {
		state: state,
		colors: colors,
		width: width,
		height: height,
		ctx: ctx
	}

	CCA1DsetRandomState(context)
	CCA1Drender(0, context);
	return context;
}

function fillPixel(ctx, colorRgb, x, y) {
	ctx.fillStyle = "rgb(" + colorRgb[0] + "," + colorRgb[1] + "," + colorRgb[2] + ")";
	ctx.fillRect(x, y, 1, 1);
}

function CCA1DsetRandomState(context) {
	let state = context.state;
	let colors = context.colors;
	if (!state) state = [];
	for (let x = 0; x < context.width; x++) {
		let randomColor = colors[Math.floor(Math.random() * colors.length)];
		state[x] = randomColor;
	}
}

function CCA1Drender(line, context) {
	let ctx = context.ctx;
	let state = context.state;
	for (let x = 0; x < context.width; x++) {
		fillPixel(ctx, state[x], x, line, 1);
	}
}

function CCA1Dstart(context) {
	let line = 0;
	CCA1DrenderInterval = setInterval(function () {
		if (++line === context.height) clearInterval(CCA1DrenderInterval);
		let newState = CCA1DloopCells(context);
		context.state = newState;
		CCA1Drender(line, context);
	}, 20);
}

function CCA1DloopCells(context) {
	let newState = [];
	let width = context.width;
	let state = context.state;
	for (let x = 0; x < width; x++) {
		let neighbours = [
			CCA1DgetCellColorId(context, x - 1),
			CCA1DgetCellColorId(context, x),
			CCA1DgetCellColorId(context, x + 1),
		]
		let thisCell = state[x];
		let nextColorId = nextCellColorId(thisCell, context.colors);
		let successorNeighboursCount = neighbours.filter(function (neighbour) { return neighbour.id == nextColorId })
		newState[x] = (successorNeighboursCount.length >= 1) ? successorNeighboursCount[0] : thisCell;
	}
	return newState;
}

function CCA1DgetCellColorId(context, x) {
	let state = context.state;
	let width = context.width;
	x = (x === -1) ? width - 1 : x;
	x = (x === width) ? 0 : x;
	return state[x];
}
