import type { RGB } from "../../types/RGB"
import { Automaton1D } from "../automaton1d"

export class Rule30 extends Automaton1D {
	constructor(
		canvasEl: HTMLCanvasElement,
		width: number,
		height: number,
		paletteColors?: RGB[],
	) {
		// Rule 30 always uses 2 colors (binary states)
		super(canvasEl, width, height, 2, paletteColors)
	}

	protected setInitialState(): void {
		// Single black cell in middle for Rule 30
		if (!this.state) this.state = []
		for (let x = 0; x < this.width; x++) {
			this.state[x] = this.colors[0] // white
		}
		// Place single black cell in the middle
		this.state[Math.floor(this.width / 2)] = this.colors[1] // black
	}

	protected update(line: number): void {
		const newState = []
		for (let x = 0; x < this.width; x++) {
			const pattern =
				(this.getCellColor(x - 1).id === 1 ? 4 : 0) +
				(this.getCellColor(x).id === 1 ? 2 : 0) +
				(this.getCellColor(x + 1).id === 1 ? 1 : 0)

			// Apply Rule 30
			const newStateId = [0, 1, 1, 1, 1, 0, 0, 0][pattern]
			newState[x] = this.colors[newStateId]
		}
		this.state = newState
		this.render(line)  // Use parent's render method instead of fillPixel
	}
}
