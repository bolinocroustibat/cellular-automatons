import { fillSquare2D, getNeighborsColorsIds, pickColors, randomInt, render2D, setupCanvas } from "./common"

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

	let state = []
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
	// Still lifes
	context = conwayAddBlock(context)
	context = conwayAddLoaf(context)
	context = conwayAddBoat(context)
	context = conwayAddBeehive(context)
	// Oscillators
	context = conwayAddBlinker(context)
	context = conwayAddBeacon(context)
	context = conwayAddPulsar(context)
	context = conwayAddPentadecathlon(context)
	// Spaceships
	context = conwayAddGlider(context)
	context = conwayAddLWSS(context)
	context = conwayAddMWSS(context)
	context = conwayAddHWSS(context)
	context = conwayAddGosperGliderGun(context)

	return context
}

// Still Lifes patterns

export const conwayAddBlock = (context) => {
	const loafPattern = [
		[1, 1],
		[0, 0]
	]
	return placePatternRandomly(context, loafPattern)
}

export const conwayAddLoaf = (context) => {
	const loafPattern = [
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 0, 1],
		[0, 0, 1, 0]
	]
	return placePatternRandomly(context, loafPattern)
}

export const conwayAddBoat = (context) => {
	const boatPattern = [
		[1, 1, 0],
		[1, 0, 1],
		[0, 1, 0]
	];
	return placePatternRandomly(context, boatPattern)
}

export const conwayAddBeehive = (context) => {
	const beehivePattern = [
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 1, 0]
	]
	return placePatternRandomly(context, beehivePattern)
}

// Oscillator patterns

export const conwayAddBlinker = (context) => {
	const c = Math.random();
	if (c < 0.5) {
		const horizontalBlinkerPattern = [
			[1, 1, 1]
		]
		return placePatternRandomly(context, horizontalBlinkerPattern)
	}
	else {
		const verticalBlinkerPattern = [
			[1],
			[1],
			[1]
		]
		return placePatternRandomly(context, verticalBlinkerPattern)
	}
}

export const conwayAddBeacon = (context) => {
	const beaconPattern = [
		[1, 1, 0, 0],
		[1, 1, 0, 0],
		[0, 0, 1, 1],
		[0, 0, 1, 1]
	]
	return placePatternRandomly(context, beaconPattern)
}

export const conwayAddPulsar = (context) => {
	const pulsarPattern = [
		[0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
		[0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
		[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
	]
	return placePatternRandomly(context, pulsarPattern)
}

export const conwayAddPentadecathlon = (context) => {
	const pentadecathlonPattern = [
		[0, 1, 0],
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 0],
		[0, 1, 0]
	] //TODO: false pattern, to fix
	return placePatternRandomly(context, pentadecathlonPattern)
}

// Spaceships patterns

export const conwayAddGlider = (context) => {
	const gliderPattern = [
		[0, 1, 0],
		[0, 0, 1],
		[1, 1, 1]
	]
	return placePatternRandomly(context, gliderPattern)
}

export const conwayAddLWSS = (context) => {
	const lwssPattern = [
		[0, 1, 0, 0, 1],
		[1, 0, 0, 0, 0],
		[1, 0, 0, 0, 1],
		[1, 1, 1, 1, 0]
	]
	return placePatternRandomly(context, lwssPattern)
}

export const conwayAddMWSS = (context) => {
	const mwssPattern = [
		[0, 1, 0, 0, 0, 1, 1],
		[1, 0, 0, 0, 0, 0, 0],
		[1, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 0, 0]
	]
	return placePatternRandomly(context, mwssPattern)
}

export const conwayAddHWSS = (context) => {
	const hwssPattern = [
		[0, 1, 0, 0, 0, 0, 0, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
	]
	return placePatternRandomly(context, hwssPattern)
}

export const conwayAddGosperGliderGun = (context) => {
	const gosperGliderGunPattern = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
		[0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	]
	return placePatternRandomly(context, gosperGliderGunPattern)
}

const placePatternRandomly = (context, pattern) => {
	const rndX = randomInt(0, context.colsCount - pattern[0].length) // Adjusted to ensure pattern fits within the grid
	const rndY = randomInt(0, context.rowsCount - pattern.length) // Adjusted to ensure pattern fits within the grid

	// Place the pattern at the specified position
	for (let i = 0; i < pattern.length; i++) {
		for (let j = 0; j < pattern[i].length; j++) {
			context.state[rndY + i][rndX + j] = context.colors[pattern[i][j]]; // Changed to use pattern values as color indices
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
			if (
				state[y][x] === colorOn &&
				(nbAlive < 2 || nbAlive > 3)
			) {
				// Death of an an alive cell
				newState[y][x] = colorOff
			} else if (state[y][x] === colorOff && nbAlive === 3) {
				// Birth of a cell
				newState[y][x] = colorOn
			} else {
				// Keep the same cell
				newState[y][x] = state[y][x]
			}
		}
	}
	return newState
}
