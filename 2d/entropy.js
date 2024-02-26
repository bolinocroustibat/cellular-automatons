import { Automaton2D } from "./automaton2d"

export class EntropyAutomaton extends Automaton2D {
	constructor(...args) {
		super(...args)
		clearInterval(this.renderInterval)
		// Initial random populating
		this.setRandomStateAndRender()
	}

	getMostFrequentColor(cells) {
		// TODO:
	}

	updateState = () => {
		const newState = []
		for (let y = 0; y < this.rowsCount; ++y) {
			newState[y] = []
			for (let x = 0; x < this.colsCount; ++x) {
				const neighbours = this.getNeighborsColors(x, y)

				// TODO: Tweakpane selector to choose this
				// newState[y][x] = getMostFrequentColor(neighbours)

				// TODO: Tweakpane selector to choose this
				const randomNeighbourNb = Math.floor(Math.random() * 8)
				newState[y][x] = neighbours[randomNeighbourNb]

				// Update canvas pixels
				// Optimization - fill pixels only if color value changes from previous state
				if (newState[y][x] !== this.state[y][x]) {
					this.fillSquare(
						newState[y][x],
						x * this.resolution,
						y * this.resolution,
					)
				}
			}
		}
		this.state = newState
	}
}
