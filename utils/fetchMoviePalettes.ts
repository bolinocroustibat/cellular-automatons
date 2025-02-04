import type { ListBladeApi } from "tweakpane"
import type { Movie, RGB } from "../types/MoviePalette"
import { slugify } from "./slugify"

export const moviePalettes = new Map<string, { colors: RGB[] }>()

export const fetchMoviePalettes = async (
	paletteSelector: ListBladeApi<string>,
	apiUrl: string,
): Promise<void> => {
	try {
		const response = await fetch(`${apiUrl}/movies`)
		if (!response.ok) {
			console.error(`Failed to fetch movies: ${response.status}`)
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const { movies } = (await response.json()) as { movies: Partial<Movie>[] }
		const options = [{ text: "Random", value: null }]

		for (const movie of movies) {
			if (movie.palettes?.[0]?.colors && movie.title) {
				const slug = slugify(movie.title)
				moviePalettes.set(slug, {
					colors: movie.palettes[0].colors,
				})
				options.push({
					text: movie.year ? `${movie.title} (${movie.year})` : movie.title,
					value: slug,
				})
			}
		}

		paletteSelector.options = options
	} catch (error) {
		console.error("Failed to fetch movies")
		paletteSelector.options = [{ text: "Random", value: null }]
	}
}
