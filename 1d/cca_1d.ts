import type { Cell } from "../types/Cell"
import type { RGB } from "../types/MoviePalette"
import { nextCellColorId } from "../utils/nextCellColorId"
import { pickColors } from "../utils/pickColors"
import { setupCanvas } from "../utils/setupCanvas"

export class CCA1D {
	private canvasEl: HTMLCanvasElement
	private width: number
	private height: number
	private colors: Cell[]
	private state: Cell[]
	private ctx: CanvasRenderingContext2D
	renderInterval: NodeJS.Timer

	constructor(
		canvasEl: HTMLCanvasElement,
		width: number,
		height: number,
		colorsCount: number,
		paletteColors?: RGB[],
	) {
		this.clear()
		this.canvasEl = canvasEl
		this.width = width
		this.height = height
		this.colors = pickColors(colorsCount, paletteColors)
		this.state = []
		this.ctx = setupCanvas(this.canvasEl, width, height)
		this.setRandomState()
		this.render(0)
	}

	private setRandomState = (): void => {
		if (!this.state) this.state = []
		for (let x = 0; x < this.width; x++) {
			const randomColor =
				this.colors[Math.floor(Math.random() * this.colors.length)]
			this.state[x] = randomColor
		}
	}

	clear = (): void => {
		if (this.renderInterval) {
			clearInterval(this.renderInterval)
			this.renderInterval = undefined
		}
		if (this.ctx) {
			this.ctx.clearRect(0, 0, this.width, this.height)
		}
	}

	start = (intervalMs: number): void => {
		let line = 0
		this.renderInterval = setInterval(() => {
			if (++line === this.height) clearInterval(this.renderInterval)
			this.changeState(line)
		}, intervalMs)
	}

	private getCellColor = (x: number): Cell => {
		const modifiedX = x === -1 ? this.width - 1 : x === this.width ? 0 : x
		return this.state[modifiedX]
	}

	private changeState = (line: number): void => {
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

	private fillPixel = (
		colorRgb: [number, number, number],
		x: number,
		y: number,
	): void => {
		this.ctx.fillStyle = `rgb(${colorRgb[0]},${colorRgb[1]},${colorRgb[2]})`
		this.ctx.fillRect(x, y, 1, 1)
	}

	render = (line: number): void => {
		for (let x = 0; x < this.width; x++) {
			this.fillPixel(this.state[x].colorRgb, x, line)
		}
	}
}
