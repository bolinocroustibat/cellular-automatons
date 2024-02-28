import { pickColors } from "../../utils/pickColors"
import { Automaton2D } from "../automaton2d"

export class QuadLifeAutomaton extends Automaton2D {
	constructor(...args) {
		super(...args)
		this.colorsCount = 5
		this.colors = pickColors(this.colorsCount)
		this.colorOff = this.colors[0]
		this.aliveColors = this.colors.slice(1)
		this.aliveColorIds = this.aliveColors.map((color) => color.id)

		clearInterval(this.renderInterval)

		// Initial random populating
		this.setRandomStateAndRender()

		// Manual populating
		this.canvasEl.addEventListener("mousedown", (event) => {
			const [x, y] = this.getCursorPosition(event)
			this.state[y][x] = this.colors[1]
			this.fillSquare(
				this.colors[1].colorRgb,
				x * this.resolution,
				y * this.resolution,
			)
		})
	}

	getCursorPosition = (event) => {
		const rect = this.canvasEl.getBoundingClientRect()
		const pixelX = event.clientX - rect.left
		const pixelY = event.clientY - rect.top
		const x = ~~(pixelX / this.resolution)
		const y = ~~(pixelY / this.resolution)
		return [x, y]
	}

	getQuadLifeColor = (aliveNeighbours) => {
		if (aliveNeighbours.length === 0) return null

		// Count occurrences of each color
		const occurrences = new Map()
		for (const color of aliveNeighbours) {
			occurrences.set(color, (occurrences.get(color) || 0) + 1)
		}

		// Find the maximum occurrence count
		let maxCount = 0
		let mostFrequentColors = []
		occurrences.forEach((count, color) => {
			if (count > maxCount) {
				maxCount = count
				mostFrequentColors = [color]
			} else if (count === maxCount) {
				mostFrequentColors.push(color)
			}
		})

		if (mostFrequentColors.length === 1) {
			// If there is only one most frequent color, returns it
			return mostFrequentColors[0]
		}
		if (mostFrequentColors.length === 3) {
			// Specific QuadLife rule:
			// Return the only alive color that is not among the most frequent colors
			return this.aliveColors.find(
				(color) => !mostFrequentColors.includes(color),
			)
		}
	}

	updateState = () => {
		const newState = []
		for (let y = 0; y < this.rowsCount; ++y) {
			newState[y] = []
			for (let x = 0; x < this.colsCount; ++x) {
				const neighbours = this.getNeighborsColors(x, y)

				// Analyse neighbors info
				const aliveNeighbours = []
				for (const cell of neighbours) {
					if (this.aliveColorIds.includes(cell.id)) {
						aliveNeighbours.push(cell)
					}
				}

				// Change the newState according to the neighbors
				const isCellAlive = this.aliveColorIds.includes(this.state[y][x].id)
				const isUnderpopulated = aliveNeighbours.length < 2
				const isOverpopulated = aliveNeighbours.length > 3
				const isReproduction = aliveNeighbours.length === 3
				if (isCellAlive && (isUnderpopulated || isOverpopulated)) {
					newState[y][x] = this.colorOff
				} else if (!isCellAlive && isReproduction) {
					newState[y][x] = this.getQuadLifeColor(aliveNeighbours)
				} else {
					newState[y][x] = this.state[y][x]
				}

				// Update canvas pixels
				// Optimization - fill pixels only if color value changes from previous state
				if (newState[y][x] !== this.state[y][x]) {
					this.fillSquare(
						newState[y][x].colorRgb,
						x * this.resolution,
						y * this.resolution,
					)
				}
			}
		}
		this.state = newState
	}
}
