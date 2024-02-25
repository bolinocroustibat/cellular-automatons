import chroma from "chroma-js"


export const pickColors = (colorsCount) => {
    let rgbColorsWithId = []
    if (colorsCount === 2) {
        // Chose two colors with a contrast > 4.5 (see https://gka.github.io/chroma.js/#chroma-contrast)
        let rgbColor1 = chroma.random().rgb()
        let rgbColor2 = chroma.random().rgb()
        let retries = 0
        while (chroma.contrast(rgbColor1, rgbColor2) <= 4.5) {
            rgbColor2 = chroma.random().rgb()
            retries += 1
            if (retries > 4) {
                rgbColor1 = chroma.random().rgb()
            }
        }
        rgbColor1.id = 1
        rgbColor2.id = 2
        rgbColorsWithId = [rgbColor1, rgbColor2]
    }
    for (let i = 0; i < colorsCount; i++) {
        const rgbColor = chroma.random().rgb()
        rgbColor.id = i
        rgbColorsWithId.push(rgbColor)
    }
    return rgbColorsWithId
}

// export const pickSpectralColors = (colorsCount) => {
// 	let colors = chroma.scale('Spectral').colors(colorsCount)
// 	let rgbColorsWithId = []
// 	for (let i = 0; i < colors.length; i++) {
// 		let rgbColor = chroma(colors[i]).rgb()
// 		rgbColor.id = i
// 		rgbColorsWithId.push(rgbColor)
// 	}
// 	return rgbColorsWithId
// }
