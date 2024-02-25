import { pickColors } from "./utils/pickColors"}

class Context2D {

	canvasEl
	width
	height
	resolution
	colorsCount
	rowsCount
	colsCount
	colors
	state

	constructor(canvasEl, width, height, resolution, colorsCount) {
		this.canvasEl = canvasEl
		this.width = settings.width - (settings.width % resolution)
		this.height = settings.height - (settings.height % resolution)
		this.rowsCount = height / resolution
		this.colsCount = width / resolution
		this.colorsCount
		this.colors = pickColors(colorsCount)
		this.state = []
		this.#setupCanvas()
	}

	#setupCanvas = () => {
		this.canvasEl.width = this.width
		this.canvasEl.height = this.height
		this.canvasEl.style.width = `${this.width}px`
		this.canvasEl.style.height = `${this.height}px`
		this.canvasEl.style.margin = "auto"
		this.ctx = canvasEl.getContext("2d")
		const img = new Image()
		this.ctx.drawImage(img, 0, 0)
	}

	getCellColorId = (x, y) => {
		const modifiedX = x === -1 ? this.colsCount - 1 : x === this.colsCount ? 0 : x
		const modifiedY = y === -1 ? this.rowsCount - 1 : y === this.rowsCount ? 0 : y
		return this.state[modifiedY][modifiedX]
	}

	getNeighborsColorsIds = (context, x, y) => {
		return [
			this.getCellColorId(x - 1, y - 1),
			this.getCellColorId(x, y - 1),
			this.getCellColorId(x + 1, y - 1),
			// Middle cells
			this.getCellColorId(x - 1, y),
			this.getCellColorId(x + 1, y),
			// Lower cells
			this.getCellColorId(x - 1, y + 1),
			this.getCellColorId(x, y + 1),
			this.getCellColorId(x + 1, y + 1),
		]
	}

	nextCellColorId = (cell, colors) => {
		const cellId = cell.id
		if (cellId >= colors.length - 1) return 0
		return cellId + 1
	}

	fillSquare2D = (color, x, y) => {
		this.ctx.fillStyle = color
		this.ctx.fillRect(x, y, this.resolution, this.resolution)
	}

	render2D = () => {
		for (let y = 0; y < this.rowsCount; ++y) {
			for (let x = 0; x < this.colsCount; ++x) {
				fillSquare2D(
					this.state[y][x],
					x * this.resolution,
					y * this.resolution,
				)
			}
		}
	}

	setRandomStateAndRender2D = () => {
		// Initial random populating, create state AND render the canvas
		for (let y = 0; y < this.rowsCount; ++y) {
			for (let x = 0; x < this.colsCount; ++x) {
				if (!this.state[y]) this.state[y] = []
				this.state[y][x] = this.colors[Math.floor(Math.random() * this.colors.length)]
				fillSquare2D(
					this.state[y][x],
					x * this.resolution,
					y * this.resolution,
				)
			}
		}
	}

}
