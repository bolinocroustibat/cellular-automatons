import chroma from "chroma-js"

export const setupCanvas = (canvasEl, width, height) => {
	canvasEl.width = width
	canvasEl.height = height
	canvasEl.style.width = `${width}px`
	canvasEl.style.height = `${height}px`
	canvasEl.style.margin = "auto"
	const ctx = canvasEl.getContext("2d")
	const img = new Image()
	ctx.drawImage(img, 0, 0)
	return ctx
}

export const getNeighborsColorsIds = (context, x, y) => {
	return [
		getCellColorId(context, x - 1, y - 1),
		getCellColorId(context, x, y - 1),
		getCellColorId(context, x + 1, y - 1),

		getCellColorId(context, x - 1, y),
		getCellColorId(context, x + 1, y),

		getCellColorId(context, x - 1, y + 1),
		getCellColorId(context, x, y + 1),
		getCellColorId(context, x + 1, y + 1),
	]
}

const getCellColorId = (context, x, y) => {
	const state = context.state
	const colsCount = context.colsCount
	const rowsCount = context.rowsCount

	const modifiedX = x === -1 ? colsCount - 1 : x === colsCount ? 0 : x
	const modifiedY = y === -1 ? rowsCount - 1 : y === rowsCount ? 0 : y

	return state[modifiedY][modifiedX]
}

export const nextCellColorId = (cell, colors) => {
	const cellId = cell.id
	if (cellId >= colors.length - 1) return 0
	return cellId + 1
}

// export const pickSpectralColors = (colorsCount) => {
// 	let colors = chroma.scale('Spectral').colors(colorsCount)
// 	let rgbColorsWithId = []
// 	for (let i = 0; i < colors.length; i++) {
// 		let rgbColor = chroma(colors[i]).rgb()
// 		rgbColor.id = i
// 		rgbColorsWithId.push(rgbColor)
// 	}
// 	return rgbColorsWithId
// }

export const pickColors = (colorsCount) => {
	const rgbColorsWithId = []
	for (let i = 0; i < colorsCount; i++) {
		const rgbColor = chroma.random().rgb()
		rgbColor.id = i
		rgbColorsWithId.push(rgbColor)
	}
	return rgbColorsWithId
}

export const fillSquare2D = (ctx, colorRgb, x, y, resolution) => {
	ctx.fillStyle = `rgb(${colorRgb[0]},${colorRgb[1]},${colorRgb[2]})`
	ctx.fillRect(x, y, resolution, resolution)
}

export const render2D = (context) => {
	const ctx = context.ctx
	const state = context.state
	const resolution = context.resolution
	for (let y = 0; y < context.rowsCount; ++y) {
		for (let x = 0; x < context.colsCount; ++x) {
			fillSquare2D(ctx, state[y][x], x * resolution, y * resolution, resolution)
		}
	}
}

export const setRandomStateAndRender2D = (context) => {
	// Initial random populating, create state AND render the canvas
	const colors = context.colors
	const resolution = context.resolution
	const state = []
	for (let y = 0; y < context.rowsCount; ++y) {
		for (let x = 0; x < context.colsCount; ++x) {
			if (!state[y]) state[y] = []
			state[y][x] = colors[Math.floor(Math.random() * colors.length)]
			fillSquare2D(
				context.ctx,
				state[y][x],
				x * resolution,
				y * resolution,
				resolution,
			)
		}
	}
	context.state = state
	return context
}
