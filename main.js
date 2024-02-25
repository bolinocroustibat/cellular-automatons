import { Pane } from "tweakpane"
import { CCA1D } from "./1d/cca_1d"
import { CCA2D } from "./2d/cca_2d"
// import {
// 	conwayCreateContext,
// 	conwayRenderInterval,
// 	conwayStart,
// } from "./conway"
// import { addGosperGliderGun } from "./conway/patterns/guns"
// import {
// 	addBeacon,
// 	addBlinker,
// 	addPentadecathlon,
// 	addPulsar,
// } from "./conway/patterns/oscillators"
// import {
// 	addGlider,
// 	addHWSS,
// 	addLWSS,
// 	addMWSS,
// } from "./conway/patterns/spaceships"
// import {
// 	entropyCreateContext,
// 	entropyRenderInterval,
// 	entropyStart,
// } from "./entropy"
// import {
// 	langtonCreateContext,
// 	langtonRenderInterval,
// 	langtonStart,
// } from "./langton"

let pane
let settings
let cca

window.onload = () => {
	pane = new Pane({
		title: "Parameters",
		expanded: true,
	})
	const algoSelector = pane.addBinding({ algo: "cca-1D" }, "algo", {
		index: 1,
		label: "Algorithm",
		options: {
			"1 dimension Cyclic Cellular Automaton": "cca-1D",
			"2 dimensions Cyclic Cellular Automaton": "cca-2D",
			"Conway's game of Life": "conway",
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
	const cca2dResolutionBlade = pane.addBinding(
		{ cca2dResolution: 10 },
		"cca2dResolution",
		{ label: "Resolution", min: 1, max: 20, step: 1 },
	)
	const entropyColorsCountBlade = pane.addBinding(
		{ entropyColorsCount: 4 },
		"entropyColorsCount",
		{ label: "Number of colors", min: 2, max: 20, step: 1 },
	)
	const conwayResolution = pane.addBinding(
		{ conwayResolution: 5 },
		"conwayResolution",
		{ label: "Resolution", min: 4, max: 12, step: 1 },
	)
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
		conwayPatterns,
		entropyColorsCountBlade,
		langtonResolutionBlade,
		entropyResolutionBlade,
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
		cca2dResolutionBlade.hidden = false
	}

	const setConwayBlades = () => {
		for (const blade of blades) {
			blade.hidden = true
		}
		conwayResolution.hidden = false
		conwayPatterns.hidden = false
	}

	const setLangtonBlades = () => {
		for (const blade of blades) {
			blade.hidden = true
		}
		langtonResolutionBlade.hidden = false
	}

	const setEntropyBlades = () => {
		for (const blade of blades) {
			blade.hidden = true
		}
		entropyColorsCountBlade.hidden = false
		entropyResolutionBlade.hidden = false
	}

	setCca2dBlades()
	reset()

	algoSelector.on("change", (event) => {
		switch (event.value) {
			case "cca-1D":
				setCca1dBlades()
				break
			case "cca-2D":
				setCca2dBlades()
				break
			case "conway":
				setConwayBlades()
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
		context = addBlinker(context)
	})
	addBeaconBtn.on("click", () => {
		context = addBeacon(context)
	})
	addPulsarBtn.on("click", () => {
		context = addPulsar(context)
	})
	addPentadecathlonBtn.on("click", () => {
		context = addPentadecathlon(context)
	})
	addGliderBtn.on("click", () => {
		context = addGlider(context)
	})
	addLWSSBtn.on("click", () => {
		context = addLWSS(context)
	})
	addMWSSBtn.on("click", () => {
		context = addMWSS(context)
	})
	addHWSSBtn.on("click", () => {
		context = addHWSS(context)
	})
	addGosperGliderGunBtn.on("click", () => {
		context = addGosperGliderGun(context)
	})

	resetBtn.on("click", () => {
		reset()
	})

	startBtn.on("click", () => {
		clearInterval(cca.renderInterval)
		switch (settings.algo) {
			case "cca-1D":
				cca.start()
				break
			case "cca-2D":
				cca.start(2500)
				break
			case "conway":
				conwayStart(context, 12000)
				break
			case "langton":
				langtonStart(context, 12000)
				break
			case "entropy":
				entropyStart(context, 2500)
				break
		}
	})
}

const reset = () => {
	if (cca) {
		clearInterval(cca.renderInterval)
	}
	const state = pane.exportState()
	// Convert Tweakpane state to a clean "settings" object
	settings = {}
	for (const s of state.children) {
		if (s.binding) settings[s.binding.key] = s.binding.value
	}
	// Add more keys/values to the "settings" object
	const canvasEl = document.getElementById("canvas")
	const width = window.innerWidth
	const height = window.innerHeight
	// Create the context
	switch (settings.algo) {
		case "cca-1D":
			cca = new CCA1D(canvasEl, width, height, settings.cca1dColorsCount)
			break
		case "cca-2D":
			cca = new CCA2D(canvasEl, width, height, settings.cca2dColorsCount)
			break
		case "conway":
			context = conwayCreateContext(settings)
			break
		case "langton":
			context = langtonCreateContext(settings)
			break
		case "entropy":
			context = entropyCreateContext(settings)
			break
	}
}

window.onresize = () => reset()
