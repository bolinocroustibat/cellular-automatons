import type { AutomatonBase } from "../types/Automaton"
import type { Settings } from "../types/Settings"
import { CCA1D } from "../1d/cca_1d"
import { CCA2D } from "../2d/cca_2d/cca_2d"
import { CCA3D } from "../3d/cca_3d"
import { ConwayAutomaton } from "../2d/conway/conway"
import { ImmigrationAutomaton } from "../2d/immigration/immigration"
import { QuadLifeAutomaton } from "../2d/quadlife/quadlife"
import { LangtonAutomaton } from "../2d/langton/langton"
import { EntropyAutomaton } from "../2d/entropy/entropy"

export const createAutomaton = (
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

export const cleanupAutomaton = (automaton: AutomatonBase | undefined): void => {
    if (!automaton) return
    if ("clear" in automaton) {
        automaton.clear()
    }
}
