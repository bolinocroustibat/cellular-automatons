import { fillSquare, setupCanvas, pickColors } from './common.js'

export var langtonRenderInterval

export const langtonCreateContext = (settings) => {
	clearInterval(langtonRenderInterval)

	let colorsCount = 2
	let canvasEl = settings.canvasEl
	let resolution = settings.langtonResolution
	let width = settings.width - (settings.width % resolution)
	let height = settings.height - (settings.height % resolution)

	let rowsCount = height / resolution
	let colsCount = width / resolution

	let colors = pickColors(colorsCount)
	let ctx = setupCanvas(canvasEl, width, height)

	let grid = []
	for (let x = 0; x < colsCount; ++x) {
		grid[x] = []
		for (let y = 0; y < rowsCount; ++y) {
			grid[x][y] = colors[0]
			fillSquare(ctx, grid[x][y], x * resolution, y * resolution, resolution)
		}
	}

	let context = {
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
		ctx: ctx
	}

	return context
}

export const langtonStart = (context, maxIterations = 12000) => {
	if (context) {
		let i = 0
		langtonRenderInterval = setInterval(function () {
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
	let turnX = context.orientationX
	let turnY = context.orientationY
	if (
		langtonGetCurrentPositionColorId(context) === context.colors[0]
		) {
		// Flip the color of the current cell
		context.grid[context.positionX][context.positionY] = context.colors[1]
		fillSquare(
			context.ctx,
			context.colors[1],
			context.positionX * context.resolution,
			context.positionY * context.resolution,
			context.resolution
		)
		// Turn 90° clockwise
		context.orientationX = -turnY
		context.orientationY = turnX
	} else if (
		langtonGetCurrentPositionColorId(context) === context.colors[1]
	) {
		// Flip the color of the current cell
		context.grid[context.positionX][context.positionY] = context.colors[0]
		fillSquare(
			context.ctx,
			context.colors[0],
			context.positionX * context.resolution,
			context.positionY * context.resolution,
			context.resolution
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
