import { Pane } from "tweakpane"
import { CCA1D } from "./1d/cca_1d"
import { CCA2D } from "./2d/cca_2d/cca_2d"
import { CCA3D } from "./3d/cca_3d"
import { ConwayAutomaton } from "./2d/conway/conway"
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
import { EntropyAutomaton } from "./2d/entropy/entropy"
import { ImmigrationAutomaton } from "./2d/immigration/immigration"
import { LangtonAutomaton } from "./2d/langton/langton"
import { QuadLifeAutomaton } from "./2d/quadlife/quadlife"
import type { AutomatonBase } from "./types/Automaton"
import type { Settings } from "./types/Settings"

let pane: Pane
let settings: Settings
let automaton: AutomatonBase

window.onload = () => {
	pane = new Pane({
		title: "Parameters",
		expanded: true,
	})
	const algoSelector = pane.addBinding({ algo: "cca-3D" }, "algo", {
		index: 1,
		label: "Algorithm",
		options: {
			"1 dimension Cyclic Cellular Automaton": "cca-1D",
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
	const cca2dColorsCountBlade = pane.addBinding(
		{ cca2dColorsCount: 8 },
		"cca2dColorsCount",
		{ label: "Number of colors", min: 2, max: 20, step: 1 },
	)
	const cca2dThresholdBlade = pane.addBinding(
		{ cca2dThreshold: 2 },
		"cca2dThreshold",
		{ label: "Threshold", min: 1, max: 3, step: 1 },
	)
	const cca3dColorsCountBlade = pane.addBinding(
		{ cca3dColorsCount: 8 },
		"cca3dColorsCount",
		{ label: "Number of colors", min: 5, max: 10, step: 1 },
	)
	const cca3dThresholdBlade = pane.addBinding(
		{ cca3dThreshold: 4 },
		"cca3dThreshold",
		{ label: "Threshold", min: 4, max: 10, step: 1 },
	)
	const cca3dCubeDimensionBlade = pane.addBinding(
		{ cca3dCubeDimension: 15 },
		"cca3dCubeDimension",
		{ label: "3D cube size", min: 5, max: 40, step: 1 },
	)
	const entropyColorsCountBlade = pane.addBinding(
		{ entropyColorsCount: 4 },
		"entropyColorsCount",
		{ label: "Number of colors", min: 2, max: 20, step: 1 },
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
		for (const blade of blades) {
			blade.hidden = true
		}
		cca1dColorsCountBlade.hidden = false
	}

	const setCca2dBlades = () => {
		for (const blade of blades) {
			blade.hidden = true
		}
		cca2dColorsCountBlade.hidden = false
		cca2dThresholdBlade.hidden = false
		resolutionBlade.hidden = false
	}

	const setCca3dBlades = () => {
		for (const blade of blades) {
			blade.hidden = true
		}
		cca3dColorsCountBlade.hidden = false
		cca3dThresholdBlade.hidden = false
		cca3dCubeDimensionBlade.hidden = false
	}

	const setConwayBlades = () => {
		for (const blade of blades) {
			blade.hidden = true
		}
		resolutionBlade.hidden = false
		conwayPatterns.hidden = false
		clearBtn.hidden = false
	}

	const setImmigrationBlades = () => {
		for (const blade of blades) {
			blade.hidden = true
		}
		resolutionBlade.hidden = false
	}

	const setQuadLifeBlades = () => {
		for (const blade of blades) {
			blade.hidden = true
		}
		resolutionBlade.hidden = false
	}

	const setLangtonBlades = () => {
		for (const blade of blades) {
			blade.hidden = true
		}
		resolutionBlade.hidden = false
	}

	const setEntropyBlades = () => {
		for (const blade of blades) {
			blade.hidden = true
		}
		entropyColorsCountBlade.hidden = false
		resolutionBlade.hidden = false
	}

	setCca3dBlades()
	reset()

	algoSelector.on("change", (event) => {
		switch (event.value) {
			case "cca-1D":
				setCca1dBlades()
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
		reset()
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
		reset()
	})

	startBtn.on("click", () => {
		clearInterval(automaton.renderInterval)
		switch (settings.algo) {
			case "cca-1D":
				automaton.start(10)
				break
			case "cca-2D":
				automaton.start(25, 2500)
				break
			case "cca-3D":
				automaton.start(25)
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
}

const cleanupAutomaton = (automaton: AutomatonBase): void => {
	if (!automaton) return
	if ("clear" in automaton) {
		automaton.clear()
	}
}

const getSettings = (pane: Pane): Settings => {
	const settings = {}
	for (const s of pane.exportState().children) {
		if (s.binding) settings[s.binding.key] = s.binding.value
	}
	return settings as Settings
}

const createAutomaton = (
	canvasEl: HTMLCanvasElement,
	width: number,
	height: number,
	settings: Settings,
): AutomatonBase => {
	const resolution: number = settings.resolution || 5

	switch (settings.algo) {
		case "cca-1D":
			return new CCA1D(canvasEl, width, height, settings.cca1dColorsCount || 4)
		case "cca-2D":
			return new CCA2D(
				settings.cca2dThreshold,
				canvasEl,
				width,
				height,
				resolution,
				settings.cca2dColorsCount,
			)
		case "cca-3D":
			return new CCA3D(
				canvasEl,
				width,
				height,
				settings.cca3dCubeDimension,
				settings.cca3dThreshold,
				settings.cca3dColorsCount,
			)
		case "conway":
			return new ConwayAutomaton(canvasEl, width, height, resolution)
		case "immigration":
			return new ImmigrationAutomaton(canvasEl, width, height, resolution)
		case "quadlife":
			return new QuadLifeAutomaton(canvasEl, width, height, resolution)
		case "langton":
			return new LangtonAutomaton(canvasEl, width, height, resolution)
		case "entropy":
			return new EntropyAutomaton(
				canvasEl,
				width,
				height,
				resolution,
				settings.entropyColorsCount,
			)
		default:
			throw new Error(`Unknown algorithm: ${settings.algo}`)
	}
}

const reset = (): void => {
	// Cleanup existing automaton
	cleanupAutomaton(automaton)
	automaton = undefined

	// Get new settings
	settings = getSettings(pane)

	// Get canvas and dimensions
	const canvasEl = document.getElementById("canvas") as HTMLCanvasElement
	const width = window.innerWidth
	const height = window.innerHeight

	// Create new automaton
	automaton = createAutomaton(canvasEl, width, height, settings)
}

window.onresize = (): void => reset()
