import { Context2D } from "./2d"
import { nextCellColorId } from "../utils/nextCellColorId"


export class CCA2D extends Context2D {
	threshold
	renderInterval

	constructor(threshold, ...args) {
		clearInterval(renderInterval)
		super(...args)
		this.threshold = threshold
		this.setRandomStateAndRender2D()
	}

	start = (maxIterations = 1000) => {
		if (this.state.length > 0) {
			let i = 0
			this.renderInterval = setInterval(() => {
				if (++i === maxIterations) clearInterval(this.renderInterval)
				this.changeState()
				this.render()
			}, 25)
		}
	}

	changeState = () => {
		const newState = []
		for (let y = 0; y < this.rowsCount; ++y) {
			newState[y] = []
			for (let x = 0; x < this.colsCount; ++x) {
				const neighbours = this.getNeighborsColorsIds(x, y)

				const nextColorId = nextCellColorId(this.state[y][x], this.colors)
				const successorNeighboursCount = neighbours.filter(
					(neighbour) => neighbour.id === nextColorId,
				)

				newState[y][x] =
					successorNeighboursCount.length >= this.threshold
						? successorNeighboursCount[0]
						: state[y][x]
			}
		}
		this.state = newState
	}
}
