import type { AutomatonBase } from "../types/Automaton"
import { LeniaRenderer } from "./renderer"

export class LeniaAutomaton implements AutomatonBase {
    private renderer: LeniaRenderer
    public renderInterval: number | undefined

    constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        this.renderer = new LeniaRenderer(canvas, width, height)
    }

    public start(fps: number, maxIterations?: number) {
        const interval = 1000 / fps
        this.renderInterval = setInterval(() => {
            this.renderer.render()
        }, interval)
    }

    public stop() {
        if (this.renderInterval) {
            clearInterval(this.renderInterval)
            this.renderInterval = undefined
        }
    }

    public clear() {
        this.renderer.clear()
    }
} 