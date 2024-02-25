import { pickColors } from "../utils/pickColors"
import { Automaton2D } from "./automaton2d"

export class LangtonAutomaton extends Automaton2D {
	positionX
	positionY
	orientationX
	orientationY

	constructor(...args) {
		super(...args)
		this.colorsCount = 2
		this.colors = pickColors(this.colorsCount)

		clearInterval(this.renderInterval)

		this.setUniformStateAndRender()

		// Initial values for the cursor (has to be set after the initial state)
		this.positionX = Math.round(this.state.length / 2 - 1)
		this.positionY = Math.round(this.state[0].length / 2 - 1)
		this.orientationX = -1 // start orientated towards left
		this.orientationY = 0
	}

	getCurrentPositionColorId = () => {
		// // TODO: check if position is out of bounds
		// let x = (this.positionX === -1) ? this.colsCount - 1 : this.positionX
		// x = (this.positionX === this.colsCount) ? 0 : this.positionX

		// let y = (this.positionY === -1) ? this.rowsCount - 1 : this.positionY
		// y = (this.positionY === this.rowsCount) ? 0 : this.positionY
		return this.state[this.positionX][this.positionY]
	}

	updateState = () => {
		const turnX = this.orientationX
		const turnY = this.orientationY
		if (this.getCurrentPositionColorId() === this.colors[0]) {
			// Flip the color of the current cell
			this.state[this.positionX][this.positionY] = this.colors[1]
			this.fillSquare(
				this.colors[1],
				this.positionX * this.resolution,
				this.positionY * this.resolution,
			)
			// Turn 90° clockwise
			this.orientationX = -turnY
			this.orientationY = turnX
		} else if (this.getCurrentPositionColorId() === this.colors[1]) {
			// Flip the color of the current cell
			this.state[this.positionX][this.positionY] = this.colors[0]
			this.fillSquare(
				this.colors[0],
				this.positionX * this.resolution,
				this.positionY * this.resolution,
			)
			// Turn 90° counter-clockwise
			this.orientationX = turnY
			this.orientationY = -turnX
		}
		// console.log(
		// 	'\npositionX:' + this.positionX +
		// 	'/ positionY:' + this.positionY +
		// 	'/ current color:' + this.state[this.positionX][this.positionY] +
		// 	'/ orientationX:' + this.orientationX +
		// 	'/ orientationY:' + this.orientationY
		// )
		// Move forward
		this.positionX = this.positionX + this.orientationX
		this.positionY = this.positionY + this.orientationY
	}
}
