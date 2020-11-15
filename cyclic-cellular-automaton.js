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
		cyclicStateEl(context, x - 1, y - 1),
		cyclicStateEl(context, x, y - 1),
		cyclicStateEl(context, x + 1, y - 1),

		cyclicStateEl(context, x - 1, y),
		cyclicStateEl(context, x + 1, y),

		cyclicStateEl(context, x - 1, y + 1),
		cyclicStateEl(context, x, y + 1),
		cyclicStateEl(context, x + 1, y + 1),
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

const nextCellColorId = (cell, colors) => {
	let cellId = cell.id;
	if (cellId >= (colors.length - 1)) {
		return 0;
	}
	return cellId + 1;
}

const random = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hslToHex(h, s, l) { // h = hue, s = saturation, l = lightness
	h /= 360;
	s /= 100;
	l /= 100;
	let r, g, b;
	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		var hue2rgb = function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	const toHex = x => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

var pickColors = (total, mode = 'lab', padding = .175, parts = 4) => {
	// modified version of http://www.husl-colors.org/syntax/
	let colors = [];
	const part = Math.floor(total / parts);
	const reminder = total % parts;

	// hues to pick from
	const baseHue = random(0, 360);
	const hues = [0, 60, 120, 180, 240, 300].map(offset => {
		return (baseHue + offset) % 360;
	});

	//  low saturated color
	const baseSaturation = random(5, 40);
	const baseLightness = random(0, 20);
	const rangeLightness = 90 - baseLightness;

	colors.push(hslToHex(
		hues[0],
		baseSaturation,
		baseLightness * random(.25, .75)
	));

	for (let i = 0; i < (part - 1); i++) {
		colors.push(hslToHex(
			hues[0],
			baseSaturation,
			baseLightness + (rangeLightness * Math.pow(i / (part - 1), 1.5))
		));
	}

	// random shades
	const minSat = random(50, 70);
	const maxSat = minSat + 30;
	const minLight = random(45, 80);
	const maxLight = Math.min(minLight + 40, 95);

	for (let i = 0; i < (part + reminder - 1); i++) {
		colors.push(hslToHex(
			hues[random(0, hues.length - 1)],
			random(minSat, maxSat),
			random(minLight, maxLight)
		))
	}

	colors.push(hslToHex(
		hues[0],
		baseSaturation,
		rangeLightness
	));

	colors = chroma.scale(colors).padding(padding).mode(mode).colors(total);

	let rgbColorsWithId = [];
	for (let i = 0; i < colors.length; i++) {
		let color = hexToRgb(colors[i])
		color.id = i
		rgbColorsWithId.push(color);
	}
	console.log(rgbColorsWithId)
	return rgbColorsWithId;
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