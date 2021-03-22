import chromaJs from 'https://cdn.skypack.dev/chroma-js';


export function setupCanvas(canvasEl, width, height) {
	canvasEl.width = width;
	canvasEl.height = height;
	canvasEl.style.width = width + 'px';
	canvasEl.style.height = height + 'px';
	canvasEl.style.margin = "auto";
	let ctx = canvasEl.getContext('2d');
	let img = new Image();
	ctx.drawImage(img, 0, 0);
	return ctx;
}

export function nextCellColorId(cell, colors) {
	let cellId = cell.id;
	if (cellId >= (colors.length - 1)) {
		return 0;
	}
	return cellId + 1;
}

export function pickColors(numberOfColors) {

	let minRandomColor = chromaJs.random();
	let maxRandomColor = chromaJs.random();

	let colors = chromaJs.scale([minRandomColor, maxRandomColor]).padding(0.05).colors(numberOfColors);

	let rgbColorsWithId = [];
	for (let i = 0; i < colors.length; i++) {
		let rgbColor = chromaJs(colors[i]).rgb();
		rgbColor.id = i;
		rgbColorsWithId.push(rgbColor);
	}
	return rgbColorsWithId;
}

export function fillSquare(ctx, colorRgb, x, y, resolution) {
	ctx.fillStyle = "rgb(" + colorRgb[0] + "," + colorRgb[1] + "," + colorRgb[2] + ")";
	ctx.fillRect(x, y, resolution, resolution);
}
