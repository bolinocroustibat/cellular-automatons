import { ConwayAutomaton } from "../conway/conway"


export class ImmigrationAutomaton extends ConwayAutomaton {
	constructor(...args) {
		// Modify the colorsCount to 3
		args[4] = 3
		super(...args)
		this.aliveColors = this.colors.slice(1)
		this.aliveColorIds = this.aliveColors.map((color) => color.id)
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
