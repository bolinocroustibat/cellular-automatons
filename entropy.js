import {
	getCellColorId,
	pickColors,
	render2D,
	setRandomStateAndRender2D,
	setupCanvas,
} from "./common"

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

	let context = {
		state: state,
		colors: colors,
		width: width,
		height: height,
		resolution: resolution,
		rowsCount: rowsCount,
		colsCount: colsCount,
		ctx: ctx,
	}

	// Initial random populating
	context = setRandomStateAndRender2D(context)

	return context
}

export const entropyStart = (context, maxIterations = 1000) => {
	if (context) {
		let i = 0
		entropyRenderInterval = setInterval(() => {
			if (++i === maxIterations) clearInterval(entropyRenderInterval)
			const newState = entropyChangeState(context)
			context.state = newState
			render2D(context)
		}, 25)
	}
}

const entropyChangeState = (context) => {
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
			// state[x][y] = getMostFrequentElement(neighbours)
			const randomNeighbourNb = Math.floor(Math.random() * 8)
			newState[y][x] = neighbours[randomNeighbourNb]
		}
	}
	return newState
}
