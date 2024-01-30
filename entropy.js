import { fillSquare, pickColors, setupCanvas } from "./common"

export let entropyRenderInterval

export const entropyCreateContext = (settings) => {
	clearInterval(entropyRenderInterval)

	const colorsCount = settings.entropyColorsCount
	const canvasEl = settings.canvasEl
	const resolution = settings.entropyResolution
	const width = settings.width - (settings.width % resolution)
	const height = settings.height - (settings.height % resolution)

	const rowsCount = height / resolution
	const colsCount = width / resolution

	const state = []
	const colors = pickColors(colorsCount)
	const ctx = setupCanvas(canvasEl, width, height)

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

	for (let x = 0; x < colsCount; ++x) {
		state[x] = []
		for (let y = 0; y < rowsCount; ++y) {
			const randomColor = colors[Math.floor(Math.random() * colors.length)]
			state[x][y] = randomColor
			fillSquare(
				ctx,
				state[x][y],
				x * resolution,
				y * resolution,
				resolution,
			)
		}
	}

	return context
}

export const entropyStart = (context, maxIterations = 1000) => {
	if (context) {
		let i = 0
		entropyRenderInterval = setInterval(() => {
			if (++i === maxIterations) clearInterval(entropyRenderInterval)
			const newState = entropySetNewState(context)
			context.state = newState
			entropyRender(context)
		}, 25)
	}
}

const entropySetNewState = (context) => {
	const newState = []
	for (let x = 0; x < context.colsCount; ++x) {
		newState[x] = []
		for (let y = 0; y < context.rowsCount; ++y) {
			const neighbours = [
				entropyGetCellColorId(context, x - 1, y - 1),
				entropyGetCellColorId(context, x, y - 1),
				entropyGetCellColorId(context, x + 1, y - 1),

				entropyGetCellColorId(context, x - 1, y),
				entropyGetCellColorId(context, x + 1, y),

				entropyGetCellColorId(context, x - 1, y + 1),
				entropyGetCellColorId(context, x, y + 1),
				entropyGetCellColorId(context, x + 1, y + 1),
			]
			// state[x][y] = getMostFrequentElement(neighbours)
			const randomNeighbourNb = Math.floor(Math.random() * 8)
			newState[x][y] = neighbours[randomNeighbourNb]
		}
	}
	return newState
}

const entropyGetCellColorId = (context, x, y) => {
	const state = context.state
	const colsCount = context.colsCount
	const rowsCount = context.rowsCount

	const modifiedX = x === -1 ? colsCount - 1 : x === colsCount ? 0 : x
	const modifiedY = y === -1 ? rowsCount - 1 : y === rowsCount ? 0 : y

	return state[modifiedX][modifiedY]
}

const entropyRender = (context) => {
	const ctx = context.ctx
	const state = context.state
	const resolution = context.resolution
	for (let x = 0; x < context.colsCount; ++x) {
		for (let y = 0; y < context.rowsCount; ++y) {
			fillSquare(
				ctx,
				state[x][y],
				x * resolution,
				y * resolution,
				resolution,
			)
		}
	}
}
