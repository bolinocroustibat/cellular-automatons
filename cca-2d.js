import { fillSquare, nextCellColorId, pickColors, setupCanvas } from "./common"

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

	const context = {
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

	CCA2DsetRandomState(context)
	CCA2Drender(context)
	return context
}

const CCA2Drender = (context) => {
	const rowsCount = context.rowsCount
	const colsCount = context.colsCount
	const resolution = context.resolution
	const ctx = context.ctx
	const state = context.state
	for (let y = 0; y < rowsCount; ++y) {
		for (let x = 0; x < colsCount; ++x) {
			fillSquare(ctx, state[y][x], x * resolution, y * resolution, resolution)
		}
	}
}

export const CCA2Dstart = (context, maxIterations = 1000) => {
	if (context) {
		let i = 0
		CCA2DrenderInterval = setInterval(() => {
			if (++i === maxIterations) clearInterval(CCA2DrenderInterval)
			const newState = CCA2DSetNewState(context)
			context.state = newState
			CCA2Drender(context)
		}, 25)
	}
}

const CCA2DSetNewState = (context) => {
	const rowsCount = context.rowsCount
	const colsCount = context.colsCount
	const newState = []
	for (let y = 0; y < rowsCount; ++y) {
		if (!newState[y]) newState[y] = []
		for (let x = 0; x < colsCount; ++x) {
			newState[y][x] = CCA2DCellTransformation(context, x, y)
		}
	}
	return newState
}

const CCA2DCellTransformation = (context, x, y) => {
	const state = context.state

	const threshold = context.threshold

	const neighbours = [
		CCA2DgetCellColorId(context, x - 1, y - 1),
		CCA2DgetCellColorId(context, x, y - 1),
		CCA2DgetCellColorId(context, x + 1, y - 1),

		CCA2DgetCellColorId(context, x - 1, y),
		CCA2DgetCellColorId(context, x + 1, y),

		CCA2DgetCellColorId(context, x - 1, y + 1),
		CCA2DgetCellColorId(context, x, y + 1),
		CCA2DgetCellColorId(context, x + 1, y + 1),
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

const CCA2DgetCellColorId = (context, x, y) => {
	const state = context.state
	const colsCount = context.colsCount
	const rowsCount = context.rowsCount

	x = x === -1 ? colsCount - 1 : x
	x = x === colsCount ? 0 : x

	y = y === -1 ? rowsCount - 1 : y
	y = y === rowsCount ? 0 : y

	return state[y][x]
}

const CCA2DsetRandomState = (context) => {
	const state = context.state
	const colsCount = context.colsCount
	const rowsCount = context.rowsCount
	const colors = context.colors

	for (let y = 0; y < rowsCount; ++y) {
		for (let x = 0; x < colsCount; ++x) {
			if (!state[y]) state[y] = []
			const randomColor = colors[Math.floor(Math.random() * colors.length)]
			state[y][x] = randomColor
		}
	}
}
