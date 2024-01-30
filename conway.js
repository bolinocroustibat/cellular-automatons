import { fillSquare, getCellColorId, pickColors, setupCanvas } from "./common"

export var conwayRenderInterval

export const conwayCreateContext = (settings) => {
	clearInterval(conwayRenderInterval)

	const colorsCount = 2
	const canvasEl = settings.canvasEl
	const resolution = settings.langtonResolution
	const width = settings.width - (settings.width % resolution)
	const height = settings.height - (settings.height % resolution)

	const rowsCount = height / resolution
	const colsCount = width / resolution

	const state = []
	const colors = pickColors(colorsCount)
	const ctx = setupCanvas(canvasEl, width, height)

	// Full color background
	for (let x = 0; x < colsCount; ++x) {
		state[x] = []
		for (let y = 0; y < rowsCount; ++y) {
			state[x][y] = colors[0]
			fillSquare(ctx, colors[0], x * resolution, y * resolution, resolution)
		}
	}

	// Manual populating
	canvasEl.addEventListener("mousedown", (e) => {
		const [x, y] = getCursorPosition(canvasEl, resolution, e)
		state[(x, y)] = colors[1]
		fillSquare(ctx, colors[1], x * resolution, y * resolution, resolution)
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

const getCursorPosition = (canvas, resolution, event) => {
	const rect = canvas.getBoundingClientRect()
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
			const newState = conwayChangeMatrix(context)
			context.state = newState
			conwayRender(context)
		}, 25)
	}
}

const conwayChangeMatrix = (context) => {
	const newState = []
	for (let x = 0; x < context.colsCount; ++x) {
		newState[x] = []
		for (let y = 0; y < context.rowsCount; ++y) {
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
			neighbours.forEach((cell) => {
				if (cell == context.colors[1]) {
					nbAlive++
				}
			})
			// Change the nextTable according to the neighbors
			if (
				context.currentMatrix[x][y] == context.colors[1] &&
				(nbAlive < 2 || nbAlive > 3)
			) {
				// Death of an an alive cell
				nextMatrix[x][y] = context.colors[0]
			} else if (context.currentMatrix[x][y] == false && nbAlive == 3) {
				// Birth of a cell
				newState[x][y] = context.colors[1]
			} else {
				// Keep the same cell
				newState[x][y] = context.state[x][y]
			}
		}
	}
	return newState
}

const conwayRender = (context) => {
	const ctx = context.ctx
	const state = context.state
	const resolution = context.resolution
	for (let x = 0; x < context.colsCount; ++x) {
		for (let y = 0; y < context.rowsCount; ++y) {
			fillSquare(
				ctx,
				currentMatrix[x][y],
				x * resolution,
				y * resolution,
				resolution,
			)
		}
	}
}
