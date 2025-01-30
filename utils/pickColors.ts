import chroma from "chroma-js"
import type { ColorObject } from "../types/ColorObject"
import type { MoviePalette } from "../types/MoviePalette"

const MOVIES_PALETTES_API = import.meta.env.VITE_MOVIES_PALETTES_API

// Make this synchronous in case of direct use
export const pickRandomColors = (colorsCount: number): ColorObject[] => {
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

export const pickColors = async (
	colorsCount: number,
	palette?: string,
): Promise<ColorObject[]> => {
	if (!palette) {
		return pickRandomColors(colorsCount)
	}

	try {
		// Fetch movie palette
		const response = await fetch(`${MOVIES_PALETTES_API}/palettes/${palette}`)
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const data = await response.json()

		if (!data.palettes?.length) {
			console.warn(`No palettes found for movie ${palette}`)
			return pickRandomColors(colorsCount)
		}

		const firstPalette = data.palettes[0]
		const paletteColors = firstPalette.colors
		console.log(paletteColors.length)
		console.log(colorsCount)

		// Check if we have enough colors
		if (paletteColors.length < colorsCount) {
			console.warn(
				`Not enough colors in palette for ${palette} (needed: ${colorsCount}, got: ${paletteColors.length}). Using random colors instead.`,
			)
			return pickRandomColors(colorsCount)
		}

		// Use palette colors
		return Array.from({ length: colorsCount }, (_, i) => ({
			id: i,
			colorRgb: paletteColors[i],
		}))
	} catch (error) {
		console.error("Failed to fetch movie palette:", error)
		return pickRandomColors(colorsCount)
	}
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
