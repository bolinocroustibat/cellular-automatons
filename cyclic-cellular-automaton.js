var availableColors = [
	"#006400",
	"#bdb76b",
	"#8b008b",
	"#556b2f",
	"#ff8c00",
	"#ff00ff",
	"#ffd700",
	"#008000",
	"#4b0082",
	"#f0e68c",
	"#add8e6",
	"#00ff00",
	"#800000",
	"#000080",
	"#808000",
	"#ffa500",
	"#ffc0cb",
	"#800080",
	"#ff0000",
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
	"#00008b",
	"#000000",
	"#008b8b",
	"#a9a9a9",
	"#f0ffff",
	"#ffff00"
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
	// changing all image pixels and filling color matrix, one pixel by one pixel
	let matrix = [];
	for (let i = 0; i < (width / resolution); ++i) {
		matrix[i] = [];
		for (let j = 0; j < (height / resolution); ++j) {
			let randomRGBColorAndPosition = CCARandomizeRGBColor(availableRGBColors);
			matrix[i][j] = randomRGBColorAndPosition[0];
			// now, fill all pixels within this square defined by resolution
			fillSquare(ctx, randomRGBColorAndPosition[1], i * resolution, j * resolution, resolution);
		}
	}
	return [matrix, availableRGBColors];
}

function CCAStart(width, height, resolution = 10, maxIterations = 20) {
	if ((width % resolution != 0) || (height % resolution != 0)) {
		console.log("ERROR: height and width must be a multiple of resolution");
	}
	else {
		let startConditions = CCAGenerateCanvas(width, height, resolution);
		// console.log("START CONDITIONS");
		// console.log(startConditions);
		CCALoop(startConditions[0], startConditions[1], maxIterations, resolution, i = 0);
	}
}

// LOOP
function CCALoop(matrix, availableRGBColors, maxIterations, resolution, i) {
	let maxColor = availableRGBColors.length - 1;
	matrix = CCAChangeMatrixColors(matrix, maxColor);
	CCAChangeCanvasColorsFromMatrix(matrix, availableRGBColors, resolution);
	timeoutCCA = setTimeout(function () {
		CCALoop(matrix, availableRGBColors, maxIterations, resolution, i)
	}, 200);
	// console.log("##########")
	// console.log("ITERATION: " + i);
	if (i >= maxIterations) clearTimeout(timeoutCCA);
	if (i == undefined) var i = 0;
	else i++;
}

// STOP LOOP
function CCAStop() {
	if (!(typeof timeoutCCA === 'undefined' || timeoutCCA === null)) clearTimeout(timeoutCCA);
}

function CCAChangeMatrixColors(currentMatrix, maxColor) {
	let nextMatrix = [];
	let matrixWidth = currentMatrix.length;
	let matrixHeight = currentMatrix[0].length;
	pixelLoop:
	for (let i = 0; i < matrixWidth; ++i) {
		nextMatrix[i] = [];
		ColumnLoop:
		for (let j = 0; j < matrixHeight; ++j) {
			let adjacentPixelsColors = [];
			// Getting LEFT-TOP pixel color (0)
			if (currentMatrix[i - 1] == undefined) { // extreme left
				if (currentMatrix[matrixWidth - 1][j - 1] == undefined) { //extreme left and extreme top
					adjacentPixelsColors[0] = currentMatrix[matrixWidth - 1][matrixHeight - 1];
				}
				else { // extreme left only
					adjacentPixelsColors[0] = currentMatrix[matrixWidth - 1][j - 1];
				}
			}
			else if (currentMatrix[i - 1][j - 1] == undefined) { //not extreme left but extreme top
				adjacentPixelsColors[0] = currentMatrix[i - 1][matrixHeight - 1];
			}
			else {
				adjacentPixelsColors[0] = currentMatrix[i - 1][j - 1];
			}
			// Getting TOP pixel color (1)
			if (currentMatrix[i][j - 1] == undefined) {
				adjacentPixelsColors[1] = currentMatrix[i][matrixHeight - 1];
			}
			else {
				adjacentPixelsColors[1] = currentMatrix[i][j - 1];
			}
			// Getting RIGHT-TOP pixel color (2)
			if (currentMatrix[i + 1] == undefined) { // extreme right
				if (currentMatrix[0][j - 1] == undefined) { //extreme right and extreme top
					adjacentPixelsColors[2] = currentMatrix[0][matrixHeight - 1];
				}
				else { // extreme right only
					adjacentPixelsColors[2] = currentMatrix[0][j - 1];
				}
			}
			else if (currentMatrix[i + 1][j - 1] == undefined) { //not extreme right but extreme top
				adjacentPixelsColors[2] = currentMatrix[i + 1][matrixHeight - 1];
			}
			else {
				adjacentPixelsColors[2] = currentMatrix[i + 1][j - 1];
			}
			// Getting LEFT pixel color (3)
			if (currentMatrix[i - 1] == undefined) {
				adjacentPixelsColors[3] = currentMatrix[matrixWidth - 1][j];
			}
			else {
				adjacentPixelsColors[3] = currentMatrix[i - 1][j];
			}
			// Getting RIGHT pixel color (4)
			if (currentMatrix[i + 1] == undefined) {
				adjacentPixelsColors[4] = currentMatrix[0][j];
			}
			else {
				adjacentPixelsColors[4] = currentMatrix[i + 1][j];
			}
			// Getting LEFT-DOWN pixel color (5)
			if (currentMatrix[i - 1] == undefined) { // extreme left
				if (currentMatrix[matrixWidth - 1][j + 1] == undefined) { //extreme left and extreme down
					adjacentPixelsColors[5] = currentMatrix[matrixWidth - 1][0];
				}
				else { // extreme left only
					adjacentPixelsColors[5] = currentMatrix[matrixWidth - 1][j + 1];
				}
			}
			else if (currentMatrix[i - 1][j + 1] == undefined) { //not extreme left but extreme down
				adjacentPixelsColors[5] = currentMatrix[i - 1][0];
			}
			else {
				adjacentPixelsColors[5] = currentMatrix[i - 1][j + 1];
			}
			// Getting DOWN pixel color (6)
			if (currentMatrix[i][j + 1] == undefined) {
				adjacentPixelsColors[6] = currentMatrix[i][0];
			}
			else {
				adjacentPixelsColors[6] = currentMatrix[i][j + 1];
			}
			// Getting RIGHT-DOWN pixel color (7)
			if (currentMatrix[i + 1] == undefined) { // extreme right
				if (currentMatrix[0][j + 1] == undefined) { //extreme right and extreme down
					adjacentPixelsColors[7] = currentMatrix[0][0];
				}
				else { // extreme right only
					adjacentPixelsColors[7] = currentMatrix[0][j + 1];
				}
			}
			else if (currentMatrix[i + 1][j + 1] == undefined) { //not extreme right but extreme down
				adjacentPixelsColors[7] = currentMatrix[i + 1][0];
			}
			else {
				adjacentPixelsColors[7] = currentMatrix[i + 1][j + 1];
			}
			// IMPORTANT PART: Change the color
			// console.log("########")
			// console.log("COULEUR DU PIXEL [" + i + "," + j + "]");
			// console.log(currentMatrix[i][j]);
			// console.log("COULEURS ADJACENTES :");
			// console.log(adjacentPixelsColors);
			if ((currentMatrix[i][j] == maxColor) && (adjacentPixelsColors.includes(0))) { // if the color is already at maximum and there is the first color in adjacents, takes it
				// console.log("ON PREND LA COULEUR 0");
				nextMatrix[i][j] = 0;
				continue ColumnLoop;
			}
			else { // try to test all other adjacent colors to see if there is one exactly 1 bigger than the current
				for (n in adjacentPixelsColors) {
					if ((adjacentPixelsColors[n] - currentMatrix[i][j]) == 1) {
						// console.log("ON UPGRADE LA COULEUR VERS " + adjacentPixelsColors[n]);
						nextMatrix[i][j] = adjacentPixelsColors[n];
						continue ColumnLoop;
					}
				}
			}
			// else, keep the current color
			// console.log("ON CHANGE RIEN");
			nextMatrix[i][j] = currentMatrix[i][j];
		}
	}
	// console.log(nextMatrix);
	return nextMatrix;
}

function CCAChangeCanvasColorsFromMatrix(matrix, availableRGBColors, resolution) {
	let ctx = document.getElementById('cca-canvas').getContext('2d');
	let matrixWidth = matrix.length;
	let matrixHeight = matrix[0].length;
	for (let i = 0; i < matrixWidth; ++i) {
		for (let j = 0; j < matrixHeight; ++j) {
			// console.log(matrix[i][j]);
			// console.log(availableRGBColors[matrix[i][j]]);
			// fillPixel(ctx, availableRGBColors[matrix[i][j]], i, j);
			fillSquare(ctx, availableRGBColors[matrix[i][j]], i * resolution, j * resolution, resolution);
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