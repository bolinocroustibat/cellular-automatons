import { fillSquare2D, pickColors, setupCanvas } from "../common"

export let langtonRenderInterval

export const langtonCreateContext = (settings) => {
	clearInterval(langtonRenderInterval)

	const colorsCount = 2
	const canvasEl = settings.canvasEl
	const resolution = settings.langtonResolution
	const width = settings.width - (settings.width % resolution)
	const height = settings.height - (settings.height % resolution)

	const rowsCount = height / resolution
	const colsCount = width / resolution

	const colors = pickColors(colorsCount)
	const ctx = setupCanvas(canvasEl, width, height)

	const grid = []
	for (let x = 0; x < colsCount; ++x) {
		grid[x] = []
		for (let y = 0; y < rowsCount; ++y) {
			grid[x][y] = colors[0]
			fillSquare2D(ctx, grid[x][y], x * resolution, y * resolution, resolution)
		}
	}

	const context = {
		grid: grid,
		colors: colors,
		width: width,
		height: height,
		resolution: resolution,
		rowsCount: rowsCount,
		colsCount: colsCount,
		positionX: Math.round(grid.length / 2 - 1),
		positionY: Math.round(grid[0].length / 2 - 1),
		orientationX: -1, // start orientated toward left
		orientationY: 0,
		ctx: ctx,
	}

	return context
}

export const langtonStart = (context, maxIterations = 12000) => {
	if (context) {
		let i = 0
		langtonRenderInterval = setInterval(() => {
			if (++i === maxIterations) clearInterval(langtonRenderInterval)
			langtonIteration(context)
			// console.log(i)
		}, 3)
	}
}

const langtonGetCurrentPositionColorId = (context) => {
	// // TODO: check if position is out of bounds
	// let x = (context.positionX === -1) ? context.colsCount - 1 : context.positionX
	// x = (context.positionX === context.colsCount) ? 0 : context.positionX

	// let y = (context.positionY === -1) ? context.rowsCount - 1 : context.positionY
	// y = (context.positionY === context.rowsCount) ? 0 : context.positionY
	return context.grid[context.positionX][context.positionY]
}

const langtonIteration = (context) => {
	const turnX = context.orientationX
	const turnY = context.orientationY
	if (langtonGetCurrentPositionColorId(context) === context.colors[0]) {
		// Flip the color of the current cell
		context.grid[context.positionX][context.positionY] = context.colors[1]
		fillSquare2D(
			context.ctx,
			context.colors[1],
			context.positionX * context.resolution,
			context.positionY * context.resolution,
			context.resolution,
		)
		// Turn 90° clockwise
		context.orientationX = -turnY
		context.orientationY = turnX
	} else if (langtonGetCurrentPositionColorId(context) === context.colors[1]) {
		// Flip the color of the current cell
		context.grid[context.positionX][context.positionY] = context.colors[0]
		fillSquare2D(
			context.ctx,
			context.colors[0],
			context.positionX * context.resolution,
			context.positionY * context.resolution,
			context.resolution,
		)
		// Turn 90° counter-clockwise
		context.orientationX = turnY
		context.orientationY = -turnX
	}
	// console.log(
	// 	'\npositionX:' + context.positionX +
	// 	'/ positionY:' + context.positionY +
	// 	'/ current color:' + context.grid[context.positionX][context.positionY] +
	// 	'/ orientationX:' + context.orientationX +
	// 	'/ orientationY:' + context.orientationY
	// )
	// Move forward
	context.positionX = context.positionX + context.orientationX
	context.positionY = context.positionY + context.orientationY
}
