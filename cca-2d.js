import {
	getCellColorId,
	nextCellColorId,
	pickColors,
	render2D,
	setRandomStateAndRender2D,
	setupCanvas,
} from "./common"

export let CCA2DrenderInterval

export const CCA2DcreateContext = (settings) => {
	clearInterval(CCA2DrenderInterval)

	const canvasEl = settings.canvasEl
	const colorsCount = settings.cca2dColorsCount
	const threshold = settings.cca2dThreshold
	const resolution = settings.cca2dResolution
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
		threshold: threshold,
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

export const CCA2Dstart = (context, maxIterations = 1000) => {
	if (context) {
		let i = 0
		CCA2DrenderInterval = setInterval(() => {
			if (++i === maxIterations) clearInterval(CCA2DrenderInterval)
			const newState = CCA2DchangeState(context)
			context.state = newState
			render2D(context)
		}, 25)
	}
}

const CCA2DchangeState = (context) => {
	const rowsCount = context.rowsCount
	const colsCount = context.colsCount
	const newState = []
	for (let y = 0; y < rowsCount; ++y) {
		if (!newState[y]) newState[y] = []
		for (let x = 0; x < colsCount; ++x) {
			newState[y][x] = CCA2DcellTransformation(context, x, y)
		}
	}
	return newState
}

const CCA2DcellTransformation = (context, x, y) => {
	const state = context.state

	const threshold = context.threshold

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

	const thisCell = state[y][x]
	const nextColorId = nextCellColorId(thisCell, context.colors)
	const successorNeighboursCount = neighbours.filter(
		(neighbour) => neighbour.id === nextColorId,
	)

	const newCell =
		successorNeighboursCount.length >= threshold
			? successorNeighboursCount[0]
			: thisCell

	return newCell
}
