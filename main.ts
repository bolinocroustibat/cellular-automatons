import { Pane } from "tweakpane"
import { setupControls } from "./utils/setupTweakpane"
import { createAutomaton, cleanupAutomaton } from "./utils/automaton"
import type { AutomatonBase } from "./types/Automaton"
import type { Settings } from "./types/Settings"

let pane: Pane
let settings: Settings
let automaton: AutomatonBase

window.onload = () => {
	pane = new Pane({ title: "Parameters", expanded: true })
	const controls = setupControls(pane)
	
	controls.algoSelector.on("change", (event) => {
		const newUrl = `/${event.value}`
		window.history.pushState({}, '', newUrl)
		controls.setBladesVisibility(event.value)
		reset()
	})

	// Handle browser back/forward navigation
	window.addEventListener('popstate', () => {
		const newAlgo = controls.getInitialAlgo()
		if (newAlgo !== settings.algo) {
			controls.algoSelector.value = newAlgo
		}
	})

	// Pattern buttons
	controls.addBlinkerBtn?.on("click", () => {
		automaton.placePatternRandomly?.(controls.blinkerPattern())
	})
	controls.addBeaconBtn?.on("click", () => {
		automaton.placePatternRandomly?.(controls.beaconPattern())
	})
	controls.addPulsarBtn?.on("click", () => {
		automaton.placePatternRandomly?.(controls.pulsarPattern())
	})
	controls.addPentadecathlonBtn?.on("click", () => {
		automaton.placePatternRandomly?.(controls.pentadecathlonPattern())
	})
	controls.addGliderBtn?.on("click", () => {
		automaton.placePatternRandomly?.(controls.gliderPattern())
	})
	controls.addLWSSBtn?.on("click", () => {
		automaton.placePatternRandomly?.(controls.LWSSPattern())
	})
	controls.addMWSSBtn?.on("click", () => {
		automaton.placePatternRandomly?.(controls.MWSSPattern())
	})
	controls.addHWSSBtn?.on("click", () => {
		automaton.placePatternRandomly?.(controls.HWSSPattern())
	})
	controls.addGosperGliderGunBtn?.on("click", () => {
		automaton.placePatternRandomly?.(controls.gosperGliderGunPattern())
	})

	controls.clearBtn?.on("click", () => {
		if (automaton) {
			automaton.clear?.()
		}
	})

	controls.resetBtn?.on("click", () => {
		reset()
	})

	controls.startBtn?.on("click", () => {
		if (!automaton?.renderInterval) return
		clearInterval(automaton.renderInterval)
		const config = controls.automatonConfig[settings.algo]
		automaton.start(config.fps, config.maxIterations)
	})

	// Initial setup
	controls.setBladesVisibility("cca-2D")
	reset()
}

const reset = (): void => {
	cleanupAutomaton(automaton)
	settings = getSettings()
	const canvasEl = document.getElementById("canvas") as HTMLCanvasElement
	automaton = createAutomaton(canvasEl, window.innerWidth, window.innerHeight, settings)
}

const getSettings = (): Settings => {
	const settings = {}
	for (const s of pane.exportState().children) {
		if (s.binding) settings[s.binding.key] = s.binding.value
	}
	return settings as Settings
}

window.onresize = reset
