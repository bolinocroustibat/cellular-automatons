import chroma from "chroma-js"
import type { ColorObject } from "../types/ColorObject"

export const pickColors = (colorsCount: number): ColorObject[] => {
	// For 2 colors, ensure sufficient contrast
	if (colorsCount === 2) {
		const getRandomColor = () =>
			chroma.random().rgb() as [number, number, number]
		const MAX_RETRIES = 4

		let [color1, color2] = [getRandomColor(), getRandomColor()]
		let retries = 0

		while (chroma.contrast(color1, color2) <= 4.5) {
			color2 = getRandomColor()
			retries++
			if (retries > MAX_RETRIES) {
				color1 = getRandomColor()
				retries = 0
			}
		}

		return [
			{ id: 0, colorRgb: color1 },
			{ id: 1, colorRgb: color2 },
		]
	}

	// For any other number of colors, generate array directly
	return Array.from({ length: colorsCount }, (_, i) => ({
		id: i,
		colorRgb: chroma.random().rgb() as [number, number, number],
	}))
}

/*
export const pickSpectralColors = (colorsCount: number): ColorObject[] => {
	const chromaColors = chroma.scale('Spectral').colors(colorsCount)
	const colors: ColorObject[] = []
	
	for (let i = 0; i < chromaColors.length; ++i) {
		const colorRgb = chroma(chromaColors[i]).rgb()
		colors[i] = { id: i, colorRgb }
	}
	return colors
}
*/
