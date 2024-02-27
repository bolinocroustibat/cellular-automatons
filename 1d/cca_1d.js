import { nextCellColorId } from "../utils/nextCellColorId"
import { pickColors } from "../utils/pickColors"
import { setupCanvas } from "../utils/setupCanvas"

export class CCA1D {
	canvasEl
	width
	height
	colorsCount
	colors
	state
	ctx
	renderInterval

	constructor(canvasEl, width, height, colorsCount) {
		this.canvasEl = canvasEl
		this.width = width
		this.height = height
		this.colorsCount = colorsCount
		this.colors = pickColors(colorsCount)
		this.state = []
		this.ctx = setupCanvas(this.canvasEl, width, height)
		clearInterval(this.renderInterval)
		this.setRandomState()
		this.render(0)
	}

	setRandomState = () => {
		if (!this.state) this.state = []
		for (let x = 0; x < this.width; x++) {
			const randomColor =
				this.colors[Math.floor(Math.random() * this.colors.length)]
			this.state[x] = randomColor
		}
	}

	start = (intervalMs) => {
		let line = 0
		this.renderInterval = setInterval(() => {
			if (++line === this.height) clearInterval(this.renderInterval)
			this.changeState(line)
		}, intervalMs)
	}

	getCellColor = (x) => {
		const modifiedX = x === -1 ? this.width - 1 : x === this.width ? 0 : x
		return this.state[modifiedX]
	}

	changeState = (line) => {
		const newState = []
		for (let x = 0; x < this.width; x++) {
			const neighbours = [
				this.getCellColor(x - 1),
				this.getCellColor(x),
				this.getCellColor(x + 1),
			]
			const nextColorId = nextCellColorId(this.state[x], this.colors)
			const successorNeighboursCount = neighbours.filter((neighbour) => {
				return neighbour.id === nextColorId
			})
			newState[x] =
				successorNeighboursCount.length >= 1
					? successorNeighboursCount[0]
					: this.state[x]
			// Render directly to the canvas to avoid another loop
			this.fillPixel(this.state[x].colorRgb, x, line)
		}
		this.state = newState
	}

	fillPixel = (color, x, y) => {
		this.ctx.fillStyle = `rgb(${colorRgb[0]},${colorRgb[1]},${colorRgb[2]})`
		this.ctx.fillRect(x, y, 1, 1)
	}

	render = (line) => {
		for (let x = 0; x < this.width; x++) {
			this.fillPixel(this.state[x].colorRgb, x, line)
		}
	}
}
