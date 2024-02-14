import { nextCellColorId, pickColors, setupCanvas } from "../common.js"

export let CCA1DrenderInterval

export const CCA1DcreateContext = (options) => {
	clearInterval(CCA1DrenderInterval)

	const canvasEl = options.canvasEl
	const colorsCount = options.cca1dColorsCount
	const width = options.width
	const height = options.height

	const state = []
	const colors = pickColors(colorsCount)
	const ctx = setupCanvas(canvasEl, width, height)

	const context = {
		state: state,
		colors: colors,
		width: width,
		height: height,
		ctx: ctx,
	}

	CCA1DsetRandomState(context)
	CCA1Drender(0, context)
	return context
}

const fillPixel = (ctx, colorRgb, x, y) => {
	ctx.fillStyle = `rgb(${colorRgb[0]},${colorRgb[1]},${colorRgb[2]})`
	ctx.fillRect(x, y, 1, 1)
}

const CCA1DsetRandomState = (context) => {
	let state = context.state
	const colors = context.colors
	if (!state) state = []
	for (let x = 0; x < context.width; x++) {
		const randomColor = colors[Math.floor(Math.random() * colors.length)]
		state[x] = randomColor
	}
}

const CCA1Drender = (line, context) => {
	const ctx = context.ctx
	const state = context.state
	for (let x = 0; x < context.width; x++) {
		fillPixel(ctx, state[x], x, line, 1)
	}
}

export const CCA1Dstart = (context) => {
	let line = 0
	CCA1DrenderInterval = setInterval(() => {
		if (++line === context.height) clearInterval(CCA1DrenderInterval)
		const newState = CCA1DchangeState(context)
		context.state = newState
		CCA1Drender(line, context)
	}, 20)
}

const CCA1DchangeState = (context) => {
	const newState = []
	const width = context.width
	const state = context.state
	for (let x = 0; x < width; x++) {
		const neighbours = [
			CCA1DgetCellColorId(context, x - 1),
			CCA1DgetCellColorId(context, x),
			CCA1DgetCellColorId(context, x + 1),
		]
		const thisCell = state[x]
		const nextColorId = nextCellColorId(thisCell, context.colors)
		const successorNeighboursCount = neighbours.filter((neighbour) => {
			return neighbour.id === nextColorId
		})
		newState[x] =
			successorNeighboursCount.length >= 1
				? successorNeighboursCount[0]
				: thisCell
	}
	return newState
}

const CCA1DgetCellColorId = (context, x) => {
	const state = context.state
	const width = context.width

	const modifiedX = x === -1 ? width - 1 : x === width ? 0 : x

	return state[modifiedX]
}
