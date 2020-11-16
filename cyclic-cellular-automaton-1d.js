var CCA1DrenderInterval;

function CCA1DcreateContext(options) {

	clearInterval(CCA1DrenderInterval);

	let canvasEl = options.canvasEl;
	let numberOfColors = options.numberOfColors;
	let threshold = options.threshold;
	let width = options.width;
	let height = options.height;

	let state = [];
	let colors = pickColors(numberOfColors);
	let ctx = CCA1DsetupCanvas(canvasEl, width, height);

	let context = {
		state: state,
		colors: colors,
		threshold: threshold,
		width: width,
		height: height,
		ctx: ctx
	}
	CCA1DsetRandomState(context)
	CCA1Drender(0, context);
	return context;
}

function fillpixel1(ctx, colorRgb, x, y) {
	ctx.fillStyle = "rgb(" + colorRgb[0] + "," + colorRgb[1] + "," + colorRgb[2] + ")";
	ctx.fillRect(x, y, 1, 1);
}

function CCA1DsetupCanvas(canvasEl, width, height) {
	canvasEl.width = width;
	canvasEl.height = height;
	canvasEl.style.width = width + 'px';
	canvasEl.style.height = height + 'px';
	let ctx = canvasEl.getContext('2d');
	let img = new Image();
	ctx.drawImage(img, 0, 0);
	return ctx;
}

function CCA1DsetRandomState(context) {
	let state = context.state;
	let colors = context.colors;
	if (!state) state = [];
	for (let x = 0; x < context.width; x++) {
		var randomColor = colors[Math.floor(Math.random() * colors.length)];
		state[x] = randomColor;
	}
}

function CCA1Drender(line, context) {
	let ctx = context.ctx;
	let state = context.state;
	for (let x = 0; x < context.width; x++) {
		fillpixel1(ctx, state[x], x, line, 1);
	}
}

function CCA1Dstart(context) {
	let line = 0;
	CCA1DrenderInterval = setInterval(function () {
		if (++line === context.height) clearInterval(CCA1DrenderInterval);
		CCA1DloopCells(context);
		CCA1Drender(line, context);
	}, 50);
}

function CCA1DloopCells(context) {
	let width = context.width;
	let state = context.state;
	let threshold = context.threshold;
	for (let x = 0; x < width; x++) {
		let neighbours = [
			getCellState(context, x - 1),
			getCellState(context, x + 1),
		]
		let thisCell = state[x];
		let nextColorId = nextCellColorId(thisCell, context.colors);
		let successorNeighboursCount = neighbours.filter(function (neighbour) { return neighbour.id == nextColorId })
		state[x] = (successorNeighboursCount.length >= threshold) ? successorNeighboursCount[0] : thisCell;
	}
}

function getCellState(context, x) {
	let state = context.state;
	let width = context.width;
	x = (x === -1) ? width - 1 : x;
	x = (x === width) ? 0 : x;
	return state[x];
}
