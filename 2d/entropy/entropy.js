import { Automaton2D } from "../automaton2d"

export class EntropyAutomaton extends Automaton2D {
	constructor(...args) {
		super(...args)
		clearInterval(this.renderInterval)
		// Initial random populating
		this.setRandomStateAndRender()
	}

	getMostFrequentColor = (colors) => {
		if (colors.length === 0) return null

		// Count occurrences of each color id
		const occurrences = new Map()
		for (const color of colors) {
			occurrences.set(color.id, (occurrences.get(color.id) || 0) + 1)
		}

		// Find the maximum occurrence count
		let maxCount = 0
		let mostFrequentIds = []
		occurrences.forEach((count, colorId) => {
			if (count > maxCount) {
				maxCount = count
				mostFrequentIds = [colorId]
			} else if (count === maxCount) {
				mostFrequentIds.push(colorId)
			}
		})

		// If there is only one most frequent color, return it
		if (mostFrequentIds.length === 1) {
			return colors.find((color) => color.id === mostFrequentIds[0])
		}

		// Else, select a random color among the most frequent ones
		const randomIndex = Math.floor(Math.random() * mostFrequentIds.length)
		const randomColorId = Number.parseInt(mostFrequentIds[randomIndex], 10)
		return colors.find((color) => color.id === randomColorId)
	}

	updateState = () => {
		const newState = []
		for (let y = 0; y < this.rowsCount; ++y) {
			newState[y] = []
			for (let x = 0; x < this.colsCount; ++x) {
				const neighbours = this.getNeighborsColors(x, y)

				newState[y][x] = this.getMostFrequentColor(neighbours)

				// Update canvas pixels
				// Optimization - fill pixels only if color value changes from previous state
				if (newState[y][x].id !== this.state[y][x].id) {
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
