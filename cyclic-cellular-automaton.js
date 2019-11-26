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

function CCAGenerateCanvas(width, height, resolution) {
	// clear the previous canvas if there is one
	if (!(typeof timeoutCCA === 'undefined' || timeoutCCA === null)) {
		clearInterval(timeoutCCA);
	}
	// get the number of colors wanted
	let nbColors = document.getElementById("nb_colors").value;
	// build the array of available RGB colors
	let availableRGBColors = [];
	for (let i = 0; i < nbColors; ++i) {
		availableRGBColors.push(hexToRgb(availableColors[i]));
	}
	// set the new canvas and CSS properties
	let canvas = document.getElementById('cca-canvas');
	canvas.width = width;
	canvas.height = height;
	canvas.style.width = width + "px";
	canvas.style.height = height + "px";
	let ctx = canvas.getContext('2d');
	let img = new Image();
	ctx.drawImage(img, 0, 0);
	img.style.display = 'none';
	// let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	// let data = imageData.data;
	// changing all image pixels and filling color state matrix, one pixel by one pixel
	let initialState = [];
	for (let y = 0; y < (height / resolution); ++y) {
		initialState[y] = [];
		for (let x = 0; x < (width / resolution); ++x) {
			let randomRGBColorAndPosition = CCARandomizeRGBColor(availableRGBColors);
			initialState[y][x] = randomRGBColorAndPosition[0];
			// now, fill all pixels within this square defined by resolution
			fillSquare(ctx, randomRGBColorAndPosition[1], x * resolution, y * resolution, resolution);
		}
	}
	return [initialState, availableRGBColors];
}

function CCAStart(width, height, resolution = 10, maxIterations = 20) {
	if ((width % resolution != 0) || (height % resolution != 0)) {
		console.log("ERROR: height and width must be a multiple of resolution");
	}
	else {
		let startConditions = CCAGenerateCanvas(width, height, resolution);
		CCALoop(startConditions[0], startConditions[1], maxIterations, resolution, i = 0);
	}
}

// LOOP
function CCALoop(state, availableRGBColors, maxIterations, resolution, i) {
	let maxColor = availableRGBColors.length - 1;
	state = CCAChangestateColors(state, maxColor);
	CCAChangeCanvasColorsFromstate(state, availableRGBColors, resolution);
	timeoutCCA = setTimeout(function () {
		CCALoop(state, availableRGBColors, maxIterations, resolution, i)
	}, 200);
	console.log("##########")
	console.log("ITERATION: " + i);
	if (i >= maxIterations) clearTimeout(timeoutCCA);
	if (i == undefined) var i = 0;
	else i++;
}

// STOP LOOP
function CCAStop() {
	if (!(typeof timeoutCCA === 'undefined' || timeoutCCA === null)) clearTimeout(timeoutCCA);
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
			let targetColor = currentState[y][x] + 1;
			if (targetColor > maxColor) {
				targetColor = 0;
			}
			// Check the surrounding 8 cells
			for (let dy = -1; dy <= 1; dy++) {
				for (let dx = -1; dx <= 1; dx++) {
					if (dy === 0 && dx === 0) continue;
					// // TODO: all the extreme cases
					// if (y + dy < 0) {
					// 	if (x + dx < 0) {
					// 		nextState[y][x] = currentState[stateHeight - 1][stateWidth - 1];
					// 	}
					// 	else if (!currentState[y - 1][x + 1]) {
					// 		nextState[y][x] = currentState[stateHeight - 1][stateWidth - 1];
					// 	}
					// }
					if (currentState[y + dy] != undefined) {
						if (currentState[y + dy][x + dx] === targetColor) {
							nextState[y][x] = targetColor;
						}
					}
					nextState[y][x] = currentState[y][x];
				}
			}
		}
	}
	return nextState;
}

function CCAChangeCanvasColorsFromstate(state, availableRGBColors, resolution) {
	let ctx = document.getElementById('cca-canvas').getContext('2d');
	let stateWidth = state[0].length;
	let stateHeight = state.length;
	for (let y = 0; y < stateHeight; ++y) {
		for (let x = 0; x < stateWidth; ++x) {
			fillSquare(ctx, availableRGBColors[state[y][x]], y * resolution, x * resolution, resolution);
		}
	}
}

function fillPixel(ctx, pixelRgb, x, y) {
	// ctx.fillStyle = 'rgb(' + [pixelRgb[0],pixelRgb[1],pixelRgb[2]].join() + ')';
	ctx.fillStyle = "rgb(" + pixelRgb[0] + "," + pixelRgb[1] + "," + pixelRgb[2] + ")";
	ctx.fillRect(x, y, 1, 1);
}

function fillSquare(ctx, pixelRgb, x, y, resolution) {
	// ctx.fillStyle = 'rgb(' + [pixelRgb[0],pixelRgb[1],pixelRgb[2]].join() + ')';
	ctx.fillStyle = "rgb(" + pixelRgb[0] + "," + pixelRgb[1] + "," + pixelRgb[2] + ")";
	ctx.fillRect(x, y, resolution, resolution);
}

// function CCARandomizeHEXColor(nbColors) {
// 	let n = Math.floor(Math.random() * nbColors);
// 	return [n, availableColors[n]];
// }

function CCARandomizeRGBColor(availableRGBColors) {
	let n = Math.floor(Math.random() * availableRGBColors.length);
	return [n, availableRGBColors[n]];
}

function hexToRgb(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		0: parseInt(result[1], 16),
		1: parseInt(result[2], 16),
		2: parseInt(result[3], 16)
	} : null;
}