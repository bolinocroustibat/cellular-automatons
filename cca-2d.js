import {
	getNeighborsColorsIds,
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
	const state = context.state
	const newState = []
	for (let y = 0; y < context.rowsCount; ++y) {
		newState[y] = []
		for (let x = 0; x < context.colsCount; ++x) {
			const threshold = context.threshold

			const neighbours = getNeighborsColorsIds(context, x, y)

			const nextColorId = nextCellColorId(state[y][x], context.colors)
			const successorNeighboursCount = neighbours.filter(
				(neighbour) => neighbour.id === nextColorId,
			)

			newState[y][x] =
				successorNeighboursCount.length >= threshold
					? successorNeighboursCount[0]
				: state[y][x]

		}
	}
	return newState
}
