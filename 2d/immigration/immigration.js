import { pickColors } from "../../utils/pickColors"
import { Automaton2D } from "../automaton2d"

export class ImmigrationAutomaton extends Automaton2D {
	constructor(...args) {
		super(...args)
		this.colorsCount = 3
		this.colors = pickColors(this.colorsCount)

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

	getMostFrequentAliveColor = (aliveNeighbours) => {
		if (aliveNeighbours.length === 0) return null
		const occurences = {}
		let mostFrequentColor = aliveNeighbours[0]
		let maxFrequency = 1
		for (const cell of aliveNeighbours) {
			if (occurences[cell] == null) occurences[cell] = 1
			else occurences[cell]++
			if (occurences[cell] > maxFrequency) {
				mostFrequentColor = cell
				maxFrequency = occurences[cell]
			}
		}
		return mostFrequentColor
	}

	updateState = () => {
		const newState = []
		const colorOff = this.colors[0]
		const aliveColorIds = [1, 2]
		for (let y = 0; y < this.rowsCount; ++y) {
			newState[y] = []
			for (let x = 0; x < this.colsCount; ++x) {
				const neighbours = this.getNeighborsColors(x, y)

				// Analyse neighbors info
				const aliveNeighbours = []
				for (const cell of neighbours) {
					if (aliveColorIds.includes(cell.id)) {
						aliveNeighbours.push(cell)
					}
				}

				// Change the newState according to the neighbors
				const isCellAlive = aliveColorIds.includes(this.state[y][x].id)
				const isUnderpopulated = aliveNeighbours.length < 2
				const isOverpopulated = aliveNeighbours.length > 3
				const isReproduction = aliveNeighbours.length === 3
				if (isCellAlive && (isUnderpopulated || isOverpopulated)) {
					newState[y][x] = colorOff
				} else if (!isCellAlive && isReproduction) {
					newState[y][x] = this.getMostFrequentAliveColor(aliveNeighbours)
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
