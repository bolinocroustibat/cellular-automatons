import { pickColors } from "../utils/pickColors"
import { Automaton2D } from "./automaton2d"

import { addGosperGliderGun } from "./conway_patterns/guns"
import {
	addBeacon,
	addBlinker,
	addPentadecathlon,
	addPulsar,
} from "./conway_patterns/oscillators"
import {
	addGlider,
	addHWSS,
	addLWSS,
	addMWSS,
} from "./conway_patterns/spaceships"
import {
	addBeehive,
	addBlock,
	addBoat,
	addLoaf,
} from "./conway_patterns/still_lifes"

export class ConwayAutomaton extends Automaton2D {
	constructor(...args) {
		super(...args)
		this.colorsCount = 2
		this.colors = pickColors(this.colorsCount)

		clearInterval(this.renderInterval)

		this.setUniformStateAndRender()

		// Manual populating
		this.canvasEl.addEventListener("mousedown", (event) => {
			const [x, y] = getCursorPosition(this.canvasEl, this.resolution, event)
			this.state[y][x] = this.colors[1]
			this.fillSquare(this.colors[1], x * this.resolution, y * this.resolution)
		})

		// Add patterns at random positions
		// Conway patterns: https://blog.amandaghassaei.com/2020/05/01/the-recursive-universe/
		// Still lifes
		addBlock(this)
		addLoaf(this)
		addBoat(this)
		addBeehive(this)
		// Oscillators
		addBlinker(this)
		addBeacon(this)
		addPulsar(this)
		addPentadecathlon(this)
		// Spaceships
		addGlider(this)
		addLWSS(this)
		addMWSS(this)
		addHWSS(this)
		// Guns
		addGosperGliderGun(this)
	}

	updateState = () => {
		const newState = []
		const colorOff = this.colors[0]
		const colorOn = this.colors[1]
		for (let y = 0; y < this.rowsCount; ++y) {
			newState[y] = []
			for (let x = 0; x < this.colsCount; ++x) {
				const neighbours = this.getNeighborsColors(x, y)

				// Analyse neighbors info
				let nbAlive = 0
				for (const cell of neighbours) {
					if (cell === colorOn) nbAlive++
				}

				// Change the nextState according to the neighbors
				const isCellAlive = this.state[y][x] === colorOn
				const isUnderpopulated = nbAlive < 2
				const isOverpopulated = nbAlive > 3
				const isReproduction = nbAlive === 3

				if (
					(isCellAlive && (isUnderpopulated || isOverpopulated)) ||
					(!isCellAlive && isReproduction)
				) {
					newState[y][x] = isCellAlive ? colorOff : colorOn
				} else {
					newState[y][x] = this.state[y][x]
				}

				// Render the square on canvas
				// Optimization - fill square only if color value changes from previous state
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
