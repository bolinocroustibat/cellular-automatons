import { Pane } from "tweakpane"
import { gosperGliderGunPattern } from "../2d/conway/patterns/guns"
import {
	beaconPattern,
	blinkerPattern,
	pentadecathlonPattern,
	pulsarPattern,
} from "../2d/conway/patterns/oscillators"
import {
	HWSSPattern,
	LWSSPattern,
	MWSSPattern,
	gliderPattern,
} from "../2d/conway/patterns/spaceships"
import type { Automaton } from "../core/Automaton"
import type { Settings } from "../types/Settings"
import { fetchMoviePalettes } from "../utils/fetchMoviePalettes"

const MOVIES_PALETTES_API = import.meta.env.VITE_MOVIES_PALETTES_API

export class Controls {
	private pane: Pane
	private automaton: Automaton | undefined
	private algoSelector: any
	private cca1dColorsCountBlade: any
	private paletteSelector: any
	private cca2dColorsCountBlade: any
	private cca2dThresholdBlade: any
	private cca3dColorsCountBlade: any
	private cca3dThresholdBlade: any
	private cca3dCubeDimensionBlade: any
	private entropyColorsCountBlade: any
	private resolutionBlade: any
	private conwayPatterns: any
	private clearBtn: any
	private resetBtn: any
	private startBtn: any
	private blades: any[]

	constructor(onSettingsChange: () => void) {
		this.pane = new Pane({
			title: "Parameters",
			expanded: true,
		})
		this.setupBlades()
		this.setupEventHandlers(onSettingsChange)
		this.setCca2dBlades() // Default view
		void fetchMoviePalettes(this.paletteSelector, MOVIES_PALETTES_API)
	}

	private getInitialAlgo(): string {
		const path = window.location.pathname.slice(1)
		const validAlgos = [
			"cca-1D",
			"rule30",
			"rule90",
			"rule110",
			"cca-2D",
			"cca-3D",
			"conway",
			"immigration",
			"quadlife",
			"langton",
			"entropy",
		]
		return validAlgos.includes(path) ? path : "cca-2D"
	}

	private setupBlades(): void {
		this.algoSelector = this.pane.addBinding(
			{ algo: this.getInitialAlgo() },
			"algo",
			{
				options: {
					"1 dimension Cyclic Cellular Automaton": "cca-1D",
					"Elementary Cellular Automaton Rule 30": "rule30",
					"Sierpinski Triangle (Rule 90)": "rule90",
					"Turing Complete Rule 110": "rule110",
					"2 dimensions Cyclic Cellular Automaton": "cca-2D",
					"3 dimensions Cyclic Cellular Automaton": "cca-3D",
					"Conway's game of Life": "conway",
					"Immigration game": "immigration",
					"Quad-Life": "quadlife",
					"Langton's ant": "langton",
					"2 dimensions Entropy Automaton": "entropy",
				},
			},
		)

		this.cca1dColorsCountBlade = this.pane.addBinding(
			{ cca1dColorsCount: 4 },
			"cca1dColorsCount",
			{ label: "Number of colors", min: 3, max: 5, step: 1 },
		)

		this.paletteSelector = this.pane.addBlade({
			view: "list",
			label: "Color Palette",
			options: [
				{ text: "Random", value: null },
				{ text: "Loading...", value: "loading" },
			],
			value: null,
		})

		this.cca2dColorsCountBlade = this.pane.addBinding(
			{ cca2dColorsCount: 4 },
			"cca2dColorsCount",
			{ label: "Number of colors", min: 3, max: 16, step: 1 },
		)

		this.cca2dThresholdBlade = this.pane.addBinding(
			{ cca2dThreshold: 3 },
			"cca2dThreshold",
			{ label: "Threshold", min: 1, max: 8, step: 1 },
		)

		this.cca3dColorsCountBlade = this.pane.addBinding(
			{ cca3dColorsCount: 4 },
			"cca3dColorsCount",
			{ label: "Number of colors", min: 3, max: 16, step: 1 },
		)

		this.cca3dThresholdBlade = this.pane.addBinding(
			{ cca3dThreshold: 3 },
			"cca3dThreshold",
			{ label: "Threshold", min: 1, max: 8, step: 1 },
		)

		this.cca3dCubeDimensionBlade = this.pane.addBinding(
			{ cca3dCubeDimension: 50 },
			"cca3dCubeDimension",
			{ label: "Cube dimension", min: 10, max: 100, step: 1 },
		)

		this.entropyColorsCountBlade = this.pane.addBinding(
			{ entropyColorsCount: 4 },
			"entropyColorsCount",
			{ label: "Number of colors", min: 3, max: 16, step: 1 },
		)

		this.resolutionBlade = this.pane.addBinding(
			{ resolution: 5 },
			"resolution",
			{ label: "Resolution", min: 1, max: 20, step: 1 },
		)

		this.conwayPatterns = this.pane.addFolder({ title: "Patterns" })
		this.clearBtn = this.pane.addButton({ title: "Clear" })
		this.resetBtn = this.pane.addButton({ title: "Reset" })
		this.startBtn = this.pane.addButton({ title: "Start" })

		this.blades = [
			this.cca1dColorsCountBlade,
			this.paletteSelector,
			this.cca2dColorsCountBlade,
			this.cca2dThresholdBlade,
			this.cca3dColorsCountBlade,
			this.cca3dThresholdBlade,
			this.cca3dCubeDimensionBlade,
			this.conwayPatterns,
			this.entropyColorsCountBlade,
			this.resolutionBlade,
			this.clearBtn,
		]
	}

	private setupEventHandlers(onSettingsChange: () => void): void {
		this.algoSelector.on("change", (event: { value: string }) => {
			const newUrl = `/${event.value}`
			window.history.pushState({}, "", newUrl)
			this.setBladesVisibility(event.value)
			onSettingsChange()
		})

		this.paletteSelector.on("change", () => {
			onSettingsChange()
		})

		// Pattern buttons
		this.setupPatternButtons()

		// Control buttons
		this.clearBtn.on("click", () => {
			if (this.automaton) {
				this.automaton.clear()
			}
		})

		this.resetBtn.on("click", () => {
			onSettingsChange()
		})

		this.startBtn.on("click", () => this.handleStart())
	}

	private setupPatternButtons(): void {
		// Oscillators folder
		const oscillators = this.conwayPatterns.addFolder({
			title: "Oscillators",
		})
		oscillators
			.addButton({ title: "Add a blinker" })
			.on("click", () => this.automaton?.placePatternRandomly(blinkerPattern()))
		oscillators
			.addButton({ title: "Add a beacon" })
			.on("click", () => this.automaton?.placePatternRandomly(beaconPattern()))
		oscillators
			.addButton({ title: "Add a pulsar" })
			.on("click", () => this.automaton?.placePatternRandomly(pulsarPattern()))
		oscillators
			.addButton({ title: "Add a pentadecathlon" })
			.on("click", () =>
				this.automaton?.placePatternRandomly(pentadecathlonPattern()),
			)

		// Spaceships folder
		const spaceships = this.conwayPatterns.addFolder({
			title: "Spaceships",
		})
		spaceships
			.addButton({ title: "Add a glider" })
			.on("click", () => this.automaton?.placePatternRandomly(gliderPattern()))
		spaceships
			.addButton({ title: "Add a LWSS" })
			.on("click", () => this.automaton?.placePatternRandomly(LWSSPattern()))
		spaceships
			.addButton({ title: "Add a MWSS" })
			.on("click", () => this.automaton?.placePatternRandomly(MWSSPattern()))
		spaceships
			.addButton({ title: "Add a HWSS" })
			.on("click", () => this.automaton?.placePatternRandomly(HWSSPattern()))

		// Guns folder
		const guns = this.conwayPatterns.addFolder({
			title: "Guns",
		})
		guns
			.addButton({ title: "Add a Gosper glider gun" })
			.on("click", () =>
				this.automaton?.placePatternRandomly(gosperGliderGunPattern()),
			)
	}

	private setBladesVisibility(algo: string): void {
		for (const blade of this.blades) {
			blade.hidden = true
		}

		switch (algo) {
			case "cca-1D":
				this.cca1dColorsCountBlade.hidden = false
				this.paletteSelector.hidden = false
				break
			case "rule30":
			case "rule90":
			case "rule110":
				this.paletteSelector.hidden = false
				break
			case "cca-2D":
				this.cca2dColorsCountBlade.hidden = false
				this.cca2dThresholdBlade.hidden = false
				this.resolutionBlade.hidden = false
				this.paletteSelector.hidden = false
				break
			case "cca-3D":
				this.cca3dColorsCountBlade.hidden = false
				this.cca3dThresholdBlade.hidden = false
				this.cca3dCubeDimensionBlade.hidden = false
				this.paletteSelector.hidden = false
				break
			case "conway":
				this.conwayPatterns.hidden = false
				this.resolutionBlade.hidden = false
				break
			case "immigration":
			case "quadlife":
				this.resolutionBlade.hidden = false
				this.paletteSelector.hidden = false
				break
			case "langton":
				this.resolutionBlade.hidden = false
				break
			case "entropy":
				this.entropyColorsCountBlade.hidden = false
				this.resolutionBlade.hidden = false
				break
		}
	}

	private handleStart(): void {
		if (!this.automaton) return

		const settings = this.getSettings()
		clearInterval(this.automaton.renderInterval)

		switch (settings.algo) {
			case "cca-1D":
			case "rule30":
			case "rule90":
			case "rule110":
				this.automaton.start(10)
				break
			case "cca-2D":
			case "entropy":
				this.automaton.start(25, 2500)
				break
			case "cca-3D":
				this.automaton.start(12)
				break
			case "conway":
			case "immigration":
			case "quadlife":
				this.automaton.start(25, 12000)
				break
			case "langton":
				this.automaton.start(3, 12000)
				break
		}
	}

	getSettings(): Settings {
		const settings: Partial<Settings> = {}
		const state = this.pane.exportState()

		for (const s of state.children) {
			if (s.binding) {
				settings[s.binding.key] = s.binding.value
			}
		}

		const paletteState = state.children.find((s) => s.label === "Color Palette")
		if (paletteState) {
			settings.palette = paletteState.value
		}

		return settings as Settings
	}

	setAutomaton(automaton: Automaton): void {
		this.automaton = automaton
	}

	private setCca2dBlades(): void {
		for (const blade of this.blades) {
			blade.hidden = true
		}
		this.cca2dColorsCountBlade.hidden = false
		this.cca2dThresholdBlade.hidden = false
		this.resolutionBlade.hidden = false
		this.paletteSelector.hidden = false
	}
}
