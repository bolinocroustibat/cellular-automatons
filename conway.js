import { fillSquare2D, getCellColorId, pickColors, render2D, setupCanvas } from "./common"

export let conwayRenderInterval

export const conwayCreateContext = (settings) => {
	clearInterval(conwayRenderInterval)

	const colorsCount = 2
	const canvasEl = settings.canvasEl
	const resolution = settings.conwayResolution
	const width = settings.width - (settings.width % resolution)
	const height = settings.height - (settings.height % resolution)

	const rowsCount = height / resolution
	const colsCount = width / resolution

	const state = []
	const colors = pickColors(colorsCount)
	const ctx = setupCanvas(canvasEl, width, height)

	// Full color background
	for (let y = 0; y < rowsCount; ++y) {
		state[y] = []
		for (let x = 0; x < colsCount; ++x) {
			state[y][x] = colors[0]
			fillSquare2D(ctx, colors[0], x * resolution, y * resolution, resolution)
		}
	}

	// Manual populating
	canvasEl.addEventListener("mousedown", (event) => {
		const [x, y] = getCursorPosition(canvasEl, resolution, event)
		state[y][x] = colors[1]
		fillSquare2D(ctx, colors[1], x * resolution, y * resolution, resolution)
	})

	const context = {
		state: state,
		colors: colors,
		width: width,
		height: height,
		resolution: resolution,
		rowsCount: rowsCount,
		colsCount: colsCount,
		ctx: ctx,
	}

	return context
}

const getCursorPosition = (canvasEl, resolution, event) => {
	const rect = canvasEl.getBoundingClientRect()
	const pixelX = event.clientX - rect.left
	const pixelY = event.clientY - rect.top
	const x = ~~(pixelX / resolution)
	const y = ~~(pixelY / resolution)
	return [x, y]
}

export const conwayStart = (context, maxIterations = 1000) => {
	if (context) {
		let i = 0
		conwayRenderInterval = setInterval(() => {
			if (++i === maxIterations) clearInterval(conwayRenderInterval)
			const newState = conwayChangeState(context)
			context.state = newState
			render2D(context)
		}, 25)
	}
}

const conwayChangeState = (context) => {
	const newState = []
	for (let y = 0; y < context.rowsCount; ++y) {
		newState[y] = []
		for (let x = 0; x < context.colsCount; ++x) {
			const neighbours = [
				getCellColorId(context, x - 1, y - 1),
				getCellColorId(context, x, y - 1),
				getCellColorId(context, x + 1, y - 1),

				getCellColorId(context, x - 1, y),
				getCellColorId(context, x + 1, y),

				getCellColorId(context, x - 1, y + 1),
				getCellColorId(context, x, y + 1),
				getCellColorId(context, x + 1, y + 1),
			]
			// Analyse neighbors info
			let nbAlive = 0
			for (const cell of neighbours) {
				if (cell === context.colors[1]) nbAlive++
			}
			// Change the nextState according to the neighbors
			if (
				context.state[y][x] === context.colors[1] &&
				(nbAlive < 2 || nbAlive > 3)
			) {
				// Death of an an alive cell
				newState[y][x] = context.colors[0]
			} else if (context.state[y][x] === false && nbAlive === 3) {
				// Birth of a cell
				newState[y][x] = context.colors[1]
			} else {
				// Keep the same cell
				newState[y][x] = context.state[y][x]
			}
		}
	}
	return newState
}
