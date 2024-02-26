import { nextCellColorId } from "../utils/nextCellColorId"
import { Automaton2D } from "./automaton2d"

export class CCA2D extends Automaton2D {
	threshold
	renderInterval

	constructor(threshold, ...args) {
		super(...args)
		this.threshold = threshold

		clearInterval(this.renderInterval)

		// Initial random populating
		this.setRandomStateAndRender()
	}

	updateState = () => {
		const newState = []
		for (let y = 0; y < this.rowsCount; ++y) {
			newState[y] = []
			for (let x = 0; x < this.colsCount; ++x) {
				const neighbours = this.getNeighborsColors(x, y)
				const nextColorId = nextCellColorId(this.state[y][x], this.colors)
				const successorNeighboursCount = neighbours.filter(
					(neighbour) => neighbour.id === nextColorId,
				)
				newState[y][x] =
					successorNeighboursCount.length >= this.threshold
						? successorNeighboursCount[0]
						: this.state[y][x]

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
