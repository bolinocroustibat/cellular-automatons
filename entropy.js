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

	const currentMatrix = []
	const colors = pickColors(colorsCount)
	const ctx = setupCanvas(canvasEl, width, height)

	const context = {
		currentMatrix: currentMatrix,
		colors: colors,
		width: width,
		height: height,
		resolution: resolution,
		rowsCount: rowsCount,
		colsCount: colsCount,
		ctx: ctx,
	}

	for (let x = 0; x < colsCount; ++x) {
		currentMatrix[x] = []
		for (let y = 0; y < rowsCount; ++y) {
			const randomColor = colors[Math.floor(Math.random() * colors.length)]
			currentMatrix[x][y] = randomColor
			fillSquare(
				ctx,
				currentMatrix[x][y],
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
			const nextMatrix = entropyChangeMatrix(context)
			context.currentMatrix = nextMatrix
			entropyRender(context)
		}, 25)
	}
}

const entropyChangeMatrix = (context) => {
	const nextMatrix = []
	for (let x = 0; x < context.colsCount; ++x) {
		nextMatrix[x] = []
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
			// currentMatrix[x][y] = getMostFrequentElement(neighbours)
			const randomNeighbourNb = Math.floor(Math.random() * 8)
			nextMatrix[x][y] = neighbours[randomNeighbourNb]
		}
	}
	return nextMatrix
}

const entropyGetCellColorId = (context, x, y) => {
	const currentMatrix = context.currentMatrix
	const colsCount = context.colsCount
	const rowsCount = context.rowsCount

	x = x === -1 ? colsCount - 1 : x
	x = x === colsCount ? 0 : x

	y = y === -1 ? rowsCount - 1 : y
	y = y === rowsCount ? 0 : y

	return currentMatrix[x][y]
}

const entropyRender = (context) => {
	const ctx = context.ctx
	const currentMatrix = context.currentMatrix
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
