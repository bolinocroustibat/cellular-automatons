import { Pane } from "tweakpane"
import { beaconPattern, blinkerPattern, pentadecathlonPattern, pulsarPattern } from "../2d/conway/patterns/oscillators"
import { HWSSPattern, LWSSPattern, MWSSPattern, gliderPattern } from "../2d/conway/patterns/spaceships"
import { gosperGliderGunPattern } from "../2d/conway/patterns/guns"

export const setupControls = (pane: Pane) => {
    // Algorithm selector
    const algoSelector = pane.addBinding({ algo: getInitialAlgo() }, "algo", {
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

    // Parameters
    const cca1dColorsCountBlade = pane.addBinding({ cca1dColorsCount: 4 }, "cca1dColorsCount", {
        label: "Number of colors",
        min: 3,
        max: 5,
        step: 1,
    })
    const cca2dColorsCountBlade = pane.addBinding({ cca2dColorsCount: 8 }, "cca2dColorsCount", {
        label: "Number of colors",
        min: 2,
        max: 20,
        step: 1,
    })
    const cca2dThresholdBlade = pane.addBinding({ cca2dThreshold: 2 }, "cca2dThreshold", {
        label: "Threshold",
        min: 1,
        max: 3,
        step: 1,
    })
    const cca3dColorsCountBlade = pane.addBinding({ cca3dColorsCount: 7 }, "cca3dColorsCount", {
        label: "Number of colors",
        min: 5,
        max: 10,
        step: 1,
    })
    const cca3dThresholdBlade = pane.addBinding({ cca3dThreshold: 4 }, "cca3dThreshold", {
        label: "Threshold",
        min: 4,
        max: 10,
        step: 1,
    })
    const cca3dCubeDimensionBlade = pane.addBinding({ cca3dCubeDimension: 20 }, "cca3dCubeDimension", {
        label: "3D cube size",
        min: 5,
        max: 30,
        step: 1,
    })
    const entropyColorsCountBlade = pane.addBinding({ entropyColorsCount: 4 }, "entropyColorsCount", {
        label: "Number of colors",
        min: 2,
        max: 20,
        step: 1,
    })
    const resolutionBlade = pane.addBinding({ resolution: 5 }, "resolution", {
        label: "Resolution",
        min: 1,
        max: 20,
        step: 1,
    })

    // Conway patterns
    const conwayPatterns = pane.addFolder({
        title: "Add patterns",
        expanded: true,
    })

    // Oscillators
    const oscillators = conwayPatterns.addFolder({ title: "Oscillators" })
    const addBlinkerBtn = oscillators.addButton({ title: "Add a blinker" })
    const addBeaconBtn = oscillators.addButton({ title: "Add a beacon" })
    const addPulsarBtn = oscillators.addButton({ title: "Add a pulsar" })
    const addPentadecathlonBtn = oscillators.addButton({ title: "Add a pentadecathlon" })

    // Spaceships
    const spaceships = conwayPatterns.addFolder({ title: "Spaceships" })
    const addGliderBtn = spaceships.addButton({ title: "Add a glider" })
    const addLWSSBtn = spaceships.addButton({ title: "Add a light-weight spaceship" })
    const addMWSSBtn = spaceships.addButton({ title: "Add a middle-weight spaceship" })
    const addHWSSBtn = spaceships.addButton({ title: "Add a heavy-weight spaceship" })

    // Guns
    const guns = conwayPatterns.addFolder({ title: "Guns" })
    const addGosperGliderGunBtn = guns.addButton({ title: "Add a Gosper Glider Gun" })

    // Global controls
    const clearBtn = pane.addButton({ title: "Clear" })
    const resetBtn = pane.addButton({ title: "Reset" })
    const startBtn = pane.addButton({ index: 10, title: "Start" })

    // Version display
    pane.addBlade({
        view: "text",
        label: "Version",
        value: `${APP_VERSION}`,
        parse: () => { },
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

    const bladesVisibility = {
        "cca-1D": () => {
            for (const blade of blades) blade.hidden = true
            cca1dColorsCountBlade.hidden = false
        },
        "cca-2D": () => {
            for (const blade of blades) blade.hidden = true
            cca2dColorsCountBlade.hidden = false
            cca2dThresholdBlade.hidden = false
            resolutionBlade.hidden = false
        },
        "cca-3D": () => {
            for (const blade of blades) blade.hidden = true
            cca3dColorsCountBlade.hidden = false
            cca3dThresholdBlade.hidden = false
            cca3dCubeDimensionBlade.hidden = false
        },
        "conway": () => {
            for (const blade of blades) blade.hidden = true
            resolutionBlade.hidden = false
            conwayPatterns.hidden = false
            clearBtn.hidden = false
        },
        "immigration": () => {
            for (const blade of blades) blade.hidden = true
            resolutionBlade.hidden = false
        },
        "quadlife": () => {
            for (const blade of blades) blade.hidden = true
            resolutionBlade.hidden = false
        },
        "langton": () => {
            for (const blade of blades) blade.hidden = true
            resolutionBlade.hidden = false
        },
        "entropy": () => {
            for (const blade of blades) blade.hidden = true
            entropyColorsCountBlade.hidden = false
            resolutionBlade.hidden = false
        }
    }

    const automatonConfig = {
        "cca-1D": { fps: 10 },
        "cca-2D": { fps: 25, maxIterations: 2500 },
        "cca-3D": { fps: 25 },
        "conway": { fps: 25, maxIterations: 12000 },
        "immigration": { fps: 25, maxIterations: 12000 },
        "quadlife": { fps: 25, maxIterations: 12000 },
        "langton": { fps: 3, maxIterations: 12000 },
        "entropy": { fps: 25, maxIterations: 2500 }
    }

    return {
        algoSelector,
        startBtn,
        resetBtn,
        clearBtn,
        addBlinkerBtn,
        addBeaconBtn,
        addPulsarBtn,
        addPentadecathlonBtn,
        addGliderBtn,
        addLWSSBtn,
        addMWSSBtn,
        addHWSSBtn,
        addGosperGliderGunBtn,
        setBladesVisibility: (algo: string) => bladesVisibility[algo]?.(),
        getInitialAlgo,
        blinkerPattern: () => blinkerPattern(),
        beaconPattern: () => beaconPattern(),
        pulsarPattern: () => pulsarPattern(),
        pentadecathlonPattern: () => pentadecathlonPattern(),
        gliderPattern: () => gliderPattern(),
        LWSSPattern: () => LWSSPattern(),
        MWSSPattern: () => MWSSPattern(),
        HWSSPattern: () => HWSSPattern(),
        gosperGliderGunPattern: () => gosperGliderGunPattern(),
        automatonConfig,
    }
}

function getInitialAlgo() {
    const path: string = window.location.pathname.slice(1)
    const validAlgos: Array<string> = [
        "cca-1D", "cca-2D", "cca-3D", "conway",
        "immigration", "quadlife", "langton", "entropy"
    ]
    return validAlgos.includes(path) ? path : "cca-2D"
}
