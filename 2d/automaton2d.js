import { pickColors } from "../utils/pickColors"
import { randomInt } from "../utils/randomInt"
import { setupCanvas } from "../utils/setupCanvas"

export class Automaton2D {
	canvasEl
	width
	height
	resolution
	colorsCount
	rowsCount
	colsCount
	colors
	state
	ctx
	renderInterval

	constructor(canvasEl, width, height, resolution, colorsCount) {
		this.canvasEl = canvasEl
		this.width = width - (width % resolution)
		this.height = height - (height % resolution)
		this.resolution = resolution
		this.rowsCount = this.height / resolution
		this.colsCount = this.width / resolution
		if (colorsCount) {
			this.colorsCount = colorsCount
			this.colors = pickColors(colorsCount)
		}
		this.state = []
		this.ctx = setupCanvas(this.canvasEl, this.width, this.height)
	}

	clear() {
		this.setUniformStateAndRender()
	}

	setUniformStateAndRender = () => {
		// Initial empty state populating, create state AND render the canvas
		for (let y = 0; y < this.rowsCount; ++y) {
			for (let x = 0; x < this.colsCount; ++x) {
				if (!this.state[y]) this.state[y] = []
				this.state[y][x] = this.colors[0]
				this.fillSquare(
					this.state[y][x].colorRgb,
					x * this.resolution,
					y * this.resolution,
				)
			}
		}
	}

	setRandomStateAndRender = () => {
		// Initial random populating, create state AND render the canvas
		for (let y = 0; y < this.rowsCount; ++y) {
			for (let x = 0; x < this.colsCount; ++x) {
				if (!this.state[y]) this.state[y] = []
				this.state[y][x] =
					this.colors[Math.floor(Math.random() * this.colors.length)]
				this.fillSquare(
					this.state[y][x].colorRgb,
					x * this.resolution,
					y * this.resolution,
				)
			}
		}
	}

	placePatternRandomly = (pattern) => {
		const posX = randomInt(0, this.colsCount - pattern[0].length) // Adjusted to ensure pattern fits within the grid
		const posY = randomInt(0, this.rowsCount - pattern.length) // Adjusted to ensure pattern fits within the grid
		// Place the pattern at the specified position
		for (let y = 0; y < pattern.length; ++y) {
			for (let x = 0; x < pattern[y].length; ++x) {
				// Change state at the specified squares
				this.state[posY + y][posX + x] = this.colors[pattern[y][x]]
				// Change canvas pixels
				this.fillSquare(
					this.colors[pattern[y][x]].colorRgb,
					(posX + x) * this.resolution,
					(posY + y) * this.resolution,
				)
			}
		}
	}

	start = (intervalMs, maxIterations) => {
		if (this.state.length > 0) {
			let i = 0
			this.renderInterval = setInterval(() => {
				if (++i === maxIterations) clearInterval(this.renderInterval)
				this.updateState()
			}, intervalMs)
		}
	}

	getCellColor = (x, y) => {
		const modifiedX =
			x === -1 ? this.colsCount - 1 : x === this.colsCount ? 0 : x
		const modifiedY =
			y === -1 ? this.rowsCount - 1 : y === this.rowsCount ? 0 : y
		return this.state[modifiedY][modifiedX]
	}

	getNeighborsColors = (x, y) => {
		return [
			this.getCellColor(x - 1, y - 1),
			this.getCellColor(x, y - 1),
			this.getCellColor(x + 1, y - 1),
			// Middle cells
			this.getCellColor(x - 1, y),
			this.getCellColor(x + 1, y),
			// Lower cells
			this.getCellColor(x - 1, y + 1),
			this.getCellColor(x, y + 1),
			this.getCellColor(x + 1, y + 1),
		]
	}

	fillSquare = (colorRgb, x, y) => {
		this.ctx.fillStyle = `rgb(${colorRgb[0]},${colorRgb[1]},${colorRgb[2]})`
		this.ctx.fillRect(x, y, this.resolution, this.resolution)
	}

	render = () => {
		for (let y = 0; y < this.rowsCount; ++y) {
			for (let x = 0; x < this.colsCount; ++x) {
				this.fillSquare(
					this.state[y][x].colorRgb,
					x * this.resolution,
					y * this.resolution,
				)
			}
		}
	}
}
