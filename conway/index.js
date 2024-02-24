import {
	fillSquare2D,
	getNeighborsColorsIds,
	pickColors,
	randomInt,
	render2D,
	setupCanvas,
} from "../common"
import { addGosperGliderGun } from "./patterns/guns"
import {
	addBeacon,
	addBlinker,
	addPentadecathlon,
	addPulsar,
} from "./patterns/oscillators"
import { addGlider, addHWSS, addLWSS, addMWSS } from "./patterns/spaceships"
import { addBeehive, addBlock, addBoat, addLoaf } from "./patterns/still_lifes"

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

	// Add patterns at random positions
	// Conway patterns: https://blog.amandaghassaei.com/2020/05/01/the-recursive-universe/
	// Still lifes
	context = addBlock(context)
	context = addLoaf(context)
	context = addBoat(context)
	context = addBeehive(context)
	// // Oscillators
	context = addBlinker(context)
	context = addBeacon(context)
	context = addPulsar(context)
	context = addPentadecathlon(context)
	// Spaceships
	context = addGlider(context)
	context = addLWSS(context)
	context = addMWSS(context)
	context = addHWSS(context)
	// Guns
	context = addGosperGliderGun(context)

	return context
}

export const placePatternRandomly = (context, pattern) => {
	const rndX = randomInt(0, context.colsCount - pattern[0].length) // Adjusted to ensure pattern fits within the grid
	const rndY = randomInt(0, context.rowsCount - pattern.length) // Adjusted to ensure pattern fits within the grid

	// Place the pattern at the specified position
	for (let i = 0; i < pattern.length; i++) {
		for (let j = 0; j < pattern[i].length; j++) {
			context.state[rndY + i][rndX + j] = context.colors[pattern[i][j]] // Changed to use pattern values as color indices
		}
	}

	render2D(context)

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
	const state = context.state
	const newState = []
	const colorOff = context.colors[0]
	const colorOn = context.colors[1]
	for (let y = 0; y < context.rowsCount; ++y) {
		newState[y] = []
		for (let x = 0; x < context.colsCount; ++x) {
			const neighbours = getNeighborsColorsIds(context, x, y)

			// Analyse neighbors info
			let nbAlive = 0
			for (const cell of neighbours) {
				if (cell === colorOn) nbAlive++
			}

			// Change the nextState according to the neighbors
			const isCellAlive = state[y][x] === colorOn
			const isUnderpopulated = nbAlive < 2
			const isOverpopulated = nbAlive > 3
			const isReproduction = nbAlive === 3

			if (
				(isCellAlive && (isUnderpopulated || isOverpopulated)) ||
				(!isCellAlive && isReproduction)
			) {
				newState[y][x] = isCellAlive ? colorOff : colorOn
			} else {
				newState[y][x] = state[y][x]
			}
		}
	}
	return newState
}
