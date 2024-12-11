import type { ColorObject } from "../../types/ColorObject"
import { ConwayAutomaton } from "../conway/conway"

export class QuadLifeAutomaton extends ConwayAutomaton {
	private aliveColors: ColorObject[]
	private aliveColorIds: number[]

	constructor(...args: [HTMLCanvasElement, number, number, number, number]) {
		// Modify the colorsCount to 5
		args[4] = 5
		super(...args)
		this.aliveColors = this.colors.slice(1)
		this.aliveColorIds = this.aliveColors.map((color) => color.id)
	}

	private getQuadLifeColor = (
		aliveNeighbours: ColorObject[],
	): ColorObject | null => {
		if (aliveNeighbours.length === 0) return null

		// Count occurrences of each color
		const occurrences = new Map<ColorObject, number>()
		for (const color of aliveNeighbours) {
			occurrences.set(color, (occurrences.get(color) || 0) + 1)
		}

		// Find the maximum occurrence count
		let maxCount = 0
		let mostFrequentColors: ColorObject[] = []
		occurrences.forEach((count, color) => {
			if (count > maxCount) {
				maxCount = count
				mostFrequentColors = [color]
			} else if (count === maxCount) {
				mostFrequentColors.push(color)
			}
		})

		if (mostFrequentColors.length === 1) {
			// If there is only one most frequent color, returns it
			return mostFrequentColors[0]
		}
		if (mostFrequentColors.length === 3) {
			// Specific QuadLife rule:
			// Return the only alive color that is not among the most frequent colors
			return (
				this.aliveColors.find((color) => !mostFrequentColors.includes(color)) ||
				null
			)
		}
		return null
	}

	protected updateState = (): void => {
		const newState: ColorObject[][] = []
		for (let y = 0; y < this.rowsCount; ++y) {
			newState[y] = []
			for (let x = 0; x < this.colsCount; ++x) {
				const neighbours = this.getNeighborsColors(x, y)

				// Analyse neighbors info
				const aliveNeighbours: ColorObject[] = []
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
					newState[y][x] =
						this.getQuadLifeColor(aliveNeighbours) || this.colorOff
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
