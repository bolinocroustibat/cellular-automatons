import type { RGB } from "../../types/RGB"
import { Automaton1D } from "../automaton1d"

export class Rule110 extends Automaton1D {
	constructor(
		canvasEl: HTMLCanvasElement,
		width: number,
		height: number,
		paletteColors?: RGB[],
	) {
		// Rule 110 uses 2 colors (binary states)
		super(canvasEl, width, height, 2, paletteColors)
	}

	protected setInitialState(): void {
		// Initialize with a single black cell near the left edge
		this.state = new Array(this.width)
		for (let x = 0; x < this.width; x++) {
			this.state[x] = this.colors[0] // white
		}
		// Place single black cell near left edge to create rightward-growing pattern
		this.state[2] = this.colors[1] // black
	}

	protected update(line: number): void {
		const newState = new Array(this.width)
		for (let x = 0; x < this.width; x++) {
			const pattern =
				(this.getCellColor(x - 1).id === 1 ? 4 : 0) +
				(this.getCellColor(x).id === 1 ? 2 : 0) +
				(this.getCellColor(x + 1).id === 1 ? 1 : 0)

			// Pattern index:     0   1   2   3   4   5   6   7
			// Binary pattern:  000 001 010 011 100 101 110 111
			const newStateId = [0,  1,  1,  1,  0,  1,  1,  0][pattern]
			newState[x] = this.colors[newStateId]
		}
		this.state = newState
		this.render(line)  // Use parent's render method
	}
}
