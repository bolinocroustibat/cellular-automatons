var entropyRenderInterval;

function entropyCreateContext(options) {

	clearInterval(entropyRenderInterval);

	let colorsCount = options.entropyColorsCount;
	let canvasEl = options.canvasEl;
	let resolution = options.entropyResolution;
	let width = options.width - (options.width % resolution);
	let height = options.height - (options.height % resolution);

	let rowsCount = height / resolution;
	let colsCount = width / resolution;

	let currentMatrix = [];
	let colors = pickColors(colorsCount);
	let ctx = setupCanvas(canvasEl, width, height);

	let context = {
		currentMatrix: currentMatrix,
		colors: colors,
		width: width,
		height: height,
		resolution: resolution,
		rowsCount: rowsCount,
		colsCount: colsCount,
		ctx: ctx
	}

	for (let x = 0; x < colsCount; ++x) {
		currentMatrix[x] = [];
		for (let y = 0; y < rowsCount; ++y) {
			let randomColor = colors[Math.floor(Math.random() * colors.length)];
			currentMatrix[x][y] = randomColor;
			fillSquare(ctx, currentMatrix[x][y], x * resolution, y * resolution, resolution);
		}
	}

	return context;
}

function entropyStart(context, maxIterations = 1000) {
	if (context) {
		let i = 0;
		entropyRenderInterval = setInterval(function () {
			if (++i === maxIterations) clearInterval(entropyRenderInterval);
			let nextMatrix = entropyChangeMatrix(context);
			context.currentMatrix = nextMatrix;
			entropyRender(context);
		}, 1);
	}
}

function entropyChangeMatrix(context) {
	let nextMatrix = [];
	for (let x = 0; x < context.colsCount; ++x) {
		nextMatrix[x] = [];
		for (let y = 0; y < context.rowsCount; ++y) {
			let neighbours = [
				entropyGetCellColorId(context, x - 1, y - 1),
				entropyGetCellColorId(context, x, y - 1),
				entropyGetCellColorId(context, x + 1, y - 1),

				entropyGetCellColorId(context, x - 1, y),
				entropyGetCellColorId(context, x + 1, y),

				entropyGetCellColorId(context, x - 1, y + 1),
				entropyGetCellColorId(context, x, y + 1),
				entropyGetCellColorId(context, x + 1, y + 1),
			]
			// currentMatrix[x][y] = getMostFrequentElement(neighbours);
			let randomNeighbourNb = Math.floor(Math.random() * 8);
			nextMatrix[x][y] = neighbours[randomNeighbourNb];
		}
	}
	return nextMatrix;
}

function entropyGetCellColorId(context, x, y) {
	let currentMatrix = context.currentMatrix;
	let colsCount = context.colsCount;
	let rowsCount = context.rowsCount;

	x = (x === -1) ? colsCount - 1 : x;
	x = (x === colsCount) ? 0 : x;

	y = (y === -1) ? rowsCount - 1 : y;
	y = (y === rowsCount) ? 0 : y;

	return currentMatrix[x][y];
}

function entropyRender(context) {
	let ctx = context.ctx;
	let currentMatrix = context.currentMatrix;
	let resolution = context.resolution;
	for (let x = 0; x < context.colsCount; ++x) {
		for (let y = 0; y < context.rowsCount; ++y) {
			fillSquare(ctx, currentMatrix[x][y], x * resolution, y * resolution, resolution);
		}
	}
}
