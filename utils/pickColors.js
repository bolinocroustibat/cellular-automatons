import chroma from "chroma-js"

export const pickColors = (colorsCount) => {
	const colors = []
	if (colorsCount === 2) {
		// Chose two colors with a contrast > 4.5 (see https://gka.github.io/chroma.js/#chroma-contrast)
		let colorRgb1 = chroma.random().rgb()
		let colorRgb2 = chroma.random().rgb()
		let retries = 0
		while (chroma.contrast(colorRgb1, colorRgb2) <= 4.5) {
			colorRgb2 = chroma.random().rgb()
			retries += 1
			if (retries > 4) {
				colorRgb1 = chroma.random().rgb()
			}
		}
		colors[0] = { id: 0, colorRgb: colorRgb1 }
		colors[1] = { id: 1, colorRgb: colorRgb2 }
	} else {
		for (let i = 0; i < colorsCount; ++i) {
			const colorRgb = chroma.random().rgb()
			colors[i] = { id: i, colorRgb: colorRgb }
		}
	}
	return colors
}

// export const pickSpectralColors = (colorsCount) => {
// 	let colors = chroma.scale('Spectral').colors(colorsCount)
// 	let colors = []
// 	for (let i = 0; i < colors.length; ++i) {
// 		const colorRgb = chroma(colors[i]).rgb()
// 		colors[i] = { "id": id, "color": colorRgb }
// 	}
// 	return colors
// }
