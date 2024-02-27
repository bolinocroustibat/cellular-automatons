import { pickColors } from "../../utils/pickColors"
import { Automaton2D } from "../automaton2d"


export class ImmigrationAutomaton extends Automaton2D {
	constructor(...args) {
		super(...args)
		this.colorsCount = 3
		this.colors = pickColors(this.colorsCount)

		clearInterval(this.renderInterval)

		// Initial random populating
		this.setRandomStateAndRender()

		// Manual populating
		this.canvasEl.addEventListener("mousedown", (event) => {
			const [x, y] = this.getCursorPosition(event)
			this.state[y][x] = this.colors[1]
			this.fillSquare(
				this.colors[1].colorRgb,
				x * this.resolution,
				y * this.resolution,
			)
		})

	}

	getCursorPosition = (event) => {
		const rect = this.canvasEl.getBoundingClientRect()
		const pixelX = event.clientX - rect.left
		const pixelY = event.clientY - rect.top
		const x = ~~(pixelX / this.resolution)
		const y = ~~(pixelY / this.resolution)
		return [x, y]
	}

	getMostFrequentAliveColor = (colors) => {
		aliveColors = colors.filter((color) => color !== this.colors[0])
		if (aliveColors.length === 0) return null

		// Count occurrences of each color id
		const occurrences = new Map()
		for (const color of aliveColors) {
			const colorId = color.id
			occurrences.set(colorId, (occurrences.get(colorId) || 0) + 1)
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



		// // If there is only one most frequent color, return it
		// if (mostFrequentIds.length === 1) {
		// 	return colors.find((color) => color.id === mostFrequentIds[0])
		// }

		// // Else, select a random color among the most frequent ones
		// const randomIndex = Math.floor(Math.random() * mostFrequentIds.length)
		// const randomColorId = parseInt(mostFrequentIds[randomIndex], 10)
		// return colors.find((color) => color.id === randomColorId)
	}

	updateState = () => {
		const newState = []
		const colorOff = this.colors[0]
		const aliveColors = colors.filter((color) => color !== this.colors[0])
		for (let y = 0; y < this.rowsCount; ++y) {
			newState[y] = []
			for (let x = 0; x < this.colsCount; ++x) {
				const neighbours = this.getNeighborsColors(x, y)

				// Analyse neighbors info
				let nbAlive = 0
				for (const cell of neighbours) {
					if (cell === colorOn) nbAlive++
				}

				// Change the newState according to the neighbors
				const isCellAlive = this.state[y][x] === colorOn
				const isUnderpopulated = nbAlive < 2
				const isOverpopulated = nbAlive > 3
				const isReproduction = nbAlive === 3
				if (isCellAlive && (isUnderpopulated || isOverpopulated)
				) {
					newState[y][x] = colorOff
				}
				else if (!isCellAlive && isReproduction) {
					//TODO: use the most frequent color of the neighbors
					newState[y][x] = getMostFrequentAliveColor(neighbours)

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
