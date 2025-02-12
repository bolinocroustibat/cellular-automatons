import * as Sentry from "@sentry/browser"
import { Pane } from "tweakpane"
import { gosperGliderGunPattern } from "./2d/conway/patterns/guns"
import {
	beaconPattern,
	blinkerPattern,
	pentadecathlonPattern,
	pulsarPattern,
} from "./2d/conway/patterns/oscillators"
import {
	HWSSPattern,
	LWSSPattern,
	MWSSPattern,
	gliderPattern,
} from "./2d/conway/patterns/spaceships"
import { Automaton } from "./core/Automaton"
import type { Settings } from "./types/Settings"
import { fetchMoviePalettes } from "./utils/fetchMoviePalettes"

let pane: Pane
let settings: Settings
let automaton: Automaton

const MOVIES_PALETTES_API = import.meta.env.VITE_MOVIES_PALETTES_API

// Initialize Sentry before any other code
Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	environment: import.meta.env.VITE_ENVIRONMENT,
	release: APP_VERSION,
	integrations: [
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration(),
	],
	// Tracing
	tracesSampleRate: 1.0, //  Capture 100% of the transactions
	// Session Replay
	replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

window.onload = () => {
	const getInitialAlgo = () => {
		const path = window.location.pathname.slice(1) // Remove leading slash
		const validAlgos = [
			"cca-1D",
			"cca-2D",
			"cca-3D",
			"conway",
			"immigration",
			"quadlife",
			"langton",
			"entropy",
			"rule30",
			"rule90",
			"rule110",
		]
		return validAlgos.includes(path) ? path : "cca-2D"
	}

	pane = new Pane({
		title: "Parameters",
		expanded: true,
	})
	const algoSelector = pane.addBinding({ algo: getInitialAlgo() }, "algo", {
		index: 1,
		label: "Algorithm",
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
	})
	const cca1dColorsCountBlade = pane.addBinding(
		{ cca1dColorsCount: 4 },
		"cca1dColorsCount",
		{ label: "Number of colors", min: 3, max: 5, step: 1 },
	)
	const paletteSelector = pane.addBlade({
		view: "list",
		label: "Color Palette",
		options: [
			{ text: "Random", value: null },
			{ text: "Loading...", value: "loading" },
		],
		value: null,
	})

	// Add onChange handler
	paletteSelector.on("change", () => {
		void reset() // Just reset automaton with new palette
	})

	const cca2dColorsCountBlade = pane.addBinding(
		{ cca2dColorsCount: 8 },
		"cca2dColorsCount",
		{ label: "Number of colors", min: 2, max: 10, step: 1 },
	)
	const cca2dThresholdBlade = pane.addBinding(
		{ cca2dThreshold: 2 },
		"cca2dThreshold",
		{ label: "Threshold", min: 1, max: 3, step: 1 },
	)
	const cca3dColorsCountBlade = pane.addBinding(
		{ cca3dColorsCount: 5 },
		"cca3dColorsCount",
		{ label: "Number of colors", min: 4, max: 10, step: 1 },
	)
	const cca3dThresholdBlade = pane.addBinding(
		{ cca3dThreshold: 4 },
		"cca3dThreshold",
		{ label: "Threshold", min: 4, max: 10, step: 1 },
	)
	const cca3dCubeDimensionBlade = pane.addBinding(
		{ cca3dCubeDimension: 15 },
		"cca3dCubeDimension",
		{ label: "3D cube size", min: 5, max: 30, step: 1 },
	)
	const entropyColorsCountBlade = pane.addBinding(
		{ entropyColorsCount: 4 },
		"entropyColorsCount",
		{ label: "Number of colors", min: 2, max: 10, step: 1 },
	)
	const resolutionBlade = pane.addBinding({ resolution: 5 }, "resolution", {
		label: "Resolution",
		min: 1,
		max: 20,
		step: 1,
	})
	const conwayPatterns = pane.addFolder({
		title: "Add patterns",
		expanded: true,
	})
	const oscillators = conwayPatterns.addFolder({
		title: "Oscillators",
	})
	const addBlinkerBtn = oscillators.addButton({
		title: "Add a blinker",
	})
	const addBeaconBtn = oscillators.addButton({
		title: "Add a beacon",
	})
	const addPulsarBtn = oscillators.addButton({
		title: "Add a pulsar",
	})
	const addPentadecathlonBtn = oscillators.addButton({
		title: "Add a pentadecathlon",
	})
	const spaceships = conwayPatterns.addFolder({
		title: "Spaceships",
	})
	const addGliderBtn = spaceships.addButton({
		title: "Add a glider",
	})
	const addLWSSBtn = spaceships.addButton({
		title: "Add a light-weight spaceship",
	})
	const addMWSSBtn = spaceships.addButton({
		title: "Add a middle-weight spaceship",
	})
	const addHWSSBtn = spaceships.addButton({
		title: "Add a heavy-weight spaceship",
	})
	const guns = conwayPatterns.addFolder({
		title: "Guns",
	})
	const addGosperGliderGunBtn = guns.addButton({
		title: "Add a Gosper Glider Gun",
	})
	const clearBtn = pane.addButton({
		title: "Clear",
	})
	const resetBtn = pane.addButton({
		title: "Reset",
	})
	const startBtn = pane.addButton({
		index: 10,
		title: "Start",
	})
	pane.addBlade({
		view: "text",
		label: "Version",
		value: `${APP_VERSION}`,
		parse: () => {},
		disabled: true,
	})

	const blades = [
		cca1dColorsCountBlade,
		paletteSelector,
		cca2dColorsCountBlade,
		cca2dThresholdBlade,
		cca3dColorsCountBlade,
		cca3dThresholdBlade,
		cca3dCubeDimensionBlade,
		conwayPatterns,
		entropyColorsCountBlade,
		resolutionBlade,
		clearBtn,
	]

	const setCca1dBlades = () => {
		for (const blade of blades) blade.hidden = true
		cca1dColorsCountBlade.hidden = false
		paletteSelector.hidden = false
	}

	const setCca2dBlades = () => {
		for (const blade of blades) blade.hidden = true
		cca2dColorsCountBlade.hidden = false
		cca2dThresholdBlade.hidden = false
		resolutionBlade.hidden = false
		paletteSelector.hidden = false
	}

	const setCca3dBlades = () => {
		for (const blade of blades) blade.hidden = true
		cca3dColorsCountBlade.hidden = false
		cca3dThresholdBlade.hidden = false
		cca3dCubeDimensionBlade.hidden = false
		paletteSelector.hidden = false
	}

	const setConwayBlades = () => {
		for (const blade of blades) blade.hidden = true
		resolutionBlade.hidden = false
		conwayPatterns.hidden = false
		clearBtn.hidden = false
	}

	const setImmigrationBlades = () => {
		for (const blade of blades) blade.hidden = true
		resolutionBlade.hidden = false
		paletteSelector.hidden = false
	}

	const setQuadLifeBlades = () => {
		for (const blade of blades) blade.hidden = true
		resolutionBlade.hidden = false
		paletteSelector.hidden = false
	}

	const setLangtonBlades = () => {
		for (const blade of blades) blade.hidden = true
		resolutionBlade.hidden = false
	}

	const setEntropyBlades = () => {
		for (const blade of blades) blade.hidden = true
		entropyColorsCountBlade.hidden = false
		resolutionBlade.hidden = false
	}

	const setRule30Blades = () => {
		for (const blade of blades) blade.hidden = true
		paletteSelector.hidden = false
	}

	const setRule90Blades = () => {
		for (const blade of blades) blade.hidden = true
		paletteSelector.hidden = false
	}

	const setRule110Blades = () => {
		for (const blade of blades) blade.hidden = true
		paletteSelector.hidden = false
	}

	setCca2dBlades()
	void reset()

	algoSelector.on("change", (event) => {
		// Update URL when algorithm changes
		const newUrl = `/${event.value}`
		window.history.pushState({}, "", newUrl)

		switch (event.value) {
			case "cca-1D":
				setCca1dBlades()
				break
			case "rule30":
				setRule30Blades()
				break
			case "rule90":
				setRule90Blades()
				break
			case "rule110":
				setRule110Blades()
				break
			case "cca-2D":
				setCca2dBlades()
				break
			case "cca-3D":
				setCca3dBlades()
				break
			case "conway":
				setConwayBlades()
				break
			case "immigration":
				setImmigrationBlades()
				break
			case "quadlife":
				setQuadLifeBlades()
				break
			case "langton":
				setLangtonBlades()
				break
			case "entropy":
				setEntropyBlades()
				break
		}
		void reset()
	})

	// Handle browser back/forward navigation
	window.addEventListener("popstate", () => {
		const newAlgo = getInitialAlgo()
		if (newAlgo !== settings.algo) {
			algoSelector.value = newAlgo
		}
	})

	addBlinkerBtn.on("click", () => {
		automaton.placePatternRandomly(blinkerPattern())
	})
	addBeaconBtn.on("click", () => {
		automaton.placePatternRandomly(beaconPattern())
	})
	addPulsarBtn.on("click", () => {
		automaton.placePatternRandomly(pulsarPattern())
	})
	addPentadecathlonBtn.on("click", () => {
		automaton.placePatternRandomly(pentadecathlonPattern())
	})
	addGliderBtn.on("click", () => {
		automaton.placePatternRandomly(gliderPattern())
	})
	addLWSSBtn.on("click", () => {
		automaton.placePatternRandomly(LWSSPattern())
	})
	addMWSSBtn.on("click", () => {
		automaton.placePatternRandomly(MWSSPattern())
	})
	addHWSSBtn.on("click", () => {
		automaton.placePatternRandomly(HWSSPattern())
	})
	addGosperGliderGunBtn.on("click", () => {
		automaton.placePatternRandomly(gosperGliderGunPattern())
	})

	clearBtn.on("click", () => {
		if (automaton) {
			automaton.clear()
		}
	})
	resetBtn.on("click", () => {
		void reset()
	})

	startBtn.on("click", () => {
		clearInterval(automaton.renderInterval)
		switch (settings.algo) {
			case "cca-1D":
				automaton.start(10)
				break
			case "rule30":
				automaton.start(10)
				break
			case "rule90":
				automaton.start(10)
				break
			case "rule110":
				automaton.start(10)
				break
			case "cca-2D":
				automaton.start(25, 2500)
				break
			case "cca-3D":
				automaton.start(12)
				break
			case "conway":
				automaton.start(25, 12000)
				break
			case "immigration":
				automaton.start(25, 12000)
				break
			case "quadlife":
				automaton.start(25, 12000)
				break
			case "langton":
				automaton.start(3, 12000)
				break
			case "entropy":
				automaton.start(25, 2500)
				break
		}
	})

	// Fetch palettes options
	void fetchMoviePalettes(paletteSelector, MOVIES_PALETTES_API)
}

const getSettings = (pane: Pane): Settings => {
	const settings: Partial<Settings> = {}
	const state = pane.exportState()

	// Handle regular bindings
	for (const s of state.children) {
		if (s.binding) {
			settings[s.binding.key] = s.binding.value
		}
	}

	// Handle palette selector specifically
	const paletteState = state.children.find((s) => s.label === "Color Palette")
	if (paletteState) {
		settings.palette = paletteState.value
	}

	return settings as Settings
}

const reset = async (): Promise<void> => {
	// Cleanup existing automaton
	Automaton.cleanup(automaton)
	automaton = undefined

	// Get new settings
	settings = getSettings(pane)

	// Get canvas and dimensions
	const canvasEl = document.getElementById("canvas") as HTMLCanvasElement
	const width = window.innerWidth
	const height = window.innerHeight

	// Create new automaton
	automaton = await Automaton.create(canvasEl, width, height, settings)
}

window.onresize = (): void => {
	void reset()
}
