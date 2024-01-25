import { Pane } from "tweakpane"
import { CCA1DcreateContext, CCA1DrenderInterval, CCA1Dstart } from "./cca-1d"
import { CCA2DcreateContext, CCA2DrenderInterval, CCA2Dstart } from "./cca-2d"
import {
	conwayCreateContext,
	conwayRenderInterval,
	conwayStart,
} from "./conway"
import {
	entropyCreateContext,
	entropyRenderInterval,
	entropyStart,
} from "./entropy"
import {
	langtonCreateContext,
	langtonRenderInterval,
	langtonStart,
} from "./langton"

let pane
let settings
let CCA1Dcontext
let CCA2Dcontext
let conwayContext
let langtonContext
let entropyContext

window.onload = () => {
	pane = new Pane()
	const artSelector = pane.addBinding({ art: "C" }, "art", {
		index: 1,
		label: "Algorithm",
		options: {
			"1 dimension Cyclic Cellular Automaton": "1",
			"2 dimensions Cyclic Cellular Automaton": "2",
			"Conway's game of Life": "C",
			"Langton's ant": "L",
			"2 dimensions Entropy Automaton": "E",
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
	const cca2dResolutionBlade = pane.addBinding(
		{ cca2dResolution: 10 },
		"cca2dResolution",
		{ label: "Resolution", min: 4, max: 20, step: 1 },
	)
	const entropyColorsCountBlade = pane.addBinding(
		{ entropyColorsCount: 4 },
		"entropyColorsCount",
		{ label: "Number of colors", min: 2, max: 20, step: 1 },
	)
	const conwayResolution = pane.addBinding(
		{ conwayResolution: 10 },
		"conwayResolution",
		{ label: "Resolution", min: 6, max: 20, step: 1 },
	)
	const langtonResolutionBlade = pane.addBinding(
		{ langtonResolution: 10 },
		"langtonResolution",
		{ label: "Resolution", min: 6, max: 20, step: 1 },
	)
	const entropyResolutionBlade = pane.addBinding(
		{ entropyResolution: 10 },
		"entropyResolution",
		{ label: "Resolution", min: 6, max: 20, step: 1 },
	)
	const resetBtn = pane.addButton({
		title: "Reset with those values",
	})
	const startBtn = pane.addButton({
		index: 10,
		title: "Start",
	})

	const blades = [
		cca1dColorsCountBlade,
		cca2dColorsCountBlade,
		cca2dThresholdBlade,
		cca2dResolutionBlade,
		conwayResolution,
		entropyColorsCountBlade,
		langtonResolutionBlade,
		entropyResolutionBlade,
	]

	// Set default
	for (const blade of blades) {
		blade.hidden = true
	}
	conwayResolution.hidden = false
	// cca2dColorsCountBlade.hidden = false
	// cca2dThresholdBlade.hidden = false
	// cca2dResolutionBlade.hidden = false

	resetContext()

	artSelector.on("change", (event) => {
		switch (event.value) {
			case "1":
				for (const blade of blades) {
					blade.hidden = true
				}
				cca1dColorsCountBlade.hidden = false
				break
			case "2":
				for (const blade of blades) {
					blade.hidden = true
				}
				cca2dColorsCountBlade.hidden = false
				cca2dThresholdBlade.hidden = false
				cca2dResolutionBlade.hidden = false
				break
			case "C":
				for (const blade of blades) {
					blade.hidden = true
				}
				conwayResolution.hidden = false
				break
			case "L":
				for (const blade of blades) {
					blade.hidden = true
				}
				langtonResolutionBlade.hidden = false
				break
			case "E":
				for (const blade of blades) {
					blade.hidden = true
				}
				entropyColorsCountBlade.hidden = false
				entropyResolutionBlade.hidden = false
				break
		}
		resetContext()
	})

	resetBtn.on("click", () => {
		resetContext()
	})

	startBtn.on("click", () => {
		clearInterval(CCA1DrenderInterval)
		clearInterval(CCA2DrenderInterval)
		clearInterval(langtonRenderInterval)
		clearInterval(entropyRenderInterval)
		switch (settings.art) {
			case "1":
				CCA1Dstart(CCA1Dcontext)
				break
			case "2":
				CCA2Dstart(CCA2Dcontext, 2500)
				break
			case "C":
				conwayStart(conwayContext, 12000)
				break
			case "L":
				langtonStart(langtonContext, 12000)
				break
			case "E":
				entropyStart(entropyContext, 2500)
				break
		}
	})
}

const resetContext = () => {
	clearInterval(CCA1DrenderInterval)
	clearInterval(CCA2DrenderInterval)
	clearInterval(conwayRenderInterval)
	clearInterval(langtonRenderInterval)
	clearInterval(entropyRenderInterval)
	const state = pane.exportState()
	// Convert Tweakpane state to a clean "settings" object
	settings = {}
	for (const s of state.children) {
		if (s.binding) settings[s.binding.key] = s.binding.value
	}
	// Add more keys/values to the "settings" object
	settings.canvasEl = document.getElementById("canvas")
	settings.width = window.innerWidth
	settings.height = window.innerHeight
	// Create the context
	switch (settings.art) {
		case "1":
			CCA1Dcontext = CCA1DcreateContext(settings)
			break
		case "2":
			CCA2Dcontext = CCA2DcreateContext(settings)
			break
		case "C":
			conwayContext = conwayCreateContext(settings)
			break
		case "L":
			langtonContext = langtonCreateContext(settings)
			break
		case "E":
			entropyContext = entropyCreateContext(settings)
			break
	}
}

window.onresize = () => resetContext()
