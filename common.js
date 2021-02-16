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
