import { pickColors } from "../utils/pickColors"
import { setupCanvas } from "../utils/setupCanvas"

export class Context2D {
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

	constructor(canvasEl, width, height, resolution, colorsCount) {
		this.canvasEl = canvasEl
		this.width = settings.width - (settings.width % resolution)
		this.height = settings.height - (settings.height % resolution)
		this.rowsCount = height / resolution
		this.colsCount = width / resolution
		this.colorsCount
		this.colors = pickColors(colorsCount)
		this.state = []
		this.ctx = setupCanvas(this.canvasEl, this.width, this.height)
	}

	#getCellColorId = (x, y) => {
		const modifiedX =
			x === -1 ? this.colsCount - 1 : x === this.colsCount ? 0 : x
		const modifiedY =
			y === -1 ? this.rowsCount - 1 : y === this.rowsCount ? 0 : y
		return this.state[modifiedY][modifiedX]
	}

	getNeighborsColorsIds = (x, y) => {
		return [
			this.#getCellColorId(x - 1, y - 1),
			this.#getCellColorId(x, y - 1),
			this.#getCellColorId(x + 1, y - 1),
			// Middle cells
			this.#getCellColorId(x - 1, y),
			this.#getCellColorId(x + 1, y),
			// Lower cells
			this.#getCellColorId(x - 1, y + 1),
			this.#getCellColorId(x, y + 1),
			this.#getCellColorId(x + 1, y + 1),
		]
	}

	fillSquare = (color, x, y) => {
		this.ctx.fillStyle = color
		this.ctx.fillRect(x, y, this.resolution, this.resolution)
	}

	render = () => {
		for (let y = 0; y < this.rowsCount; ++y) {
			for (let x = 0; x < this.colsCount; ++x) {
				this.fillSquare(this.state[y][x], x * this.resolution, y * this.resolution)
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
				this.fillSquare(this.state[y][x], x * this.resolution, y * this.resolution)
			}
		}
	}
}
