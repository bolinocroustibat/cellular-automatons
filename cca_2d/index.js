import { Context2D } from "../2d"

export let CCA2DrenderInterval

export class CCA2D extends Context2D {
	threshold

	constructor(threshold, ...args) {
		super(...args)
		this.threshold = threshold
		this.setRandomStateAndRender2D()
	}

	start = (maxIterations = 1000) => {
		if (this.state.length > 0) {
			let i = 0
			CCA2DrenderInterval = setInterval(() => {
				if (++i === maxIterations) clearInterval(CCA2DrenderInterval)
				this.changeState()
				this.render2D()
			}, 25)
		}
	}

	changeState = () => {
		const newState = []
		for (let y = 0; y < this.rowsCount; ++y) {
			newState[y] = []
			for (let x = 0; x < this.colsCount; ++x) {
				const neighbours = getNeighborsColorsIds(x, y)

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
