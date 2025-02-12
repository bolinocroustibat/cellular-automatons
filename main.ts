import * as Sentry from "@sentry/browser"
import { Automaton } from "./core/Automaton"
import { Controls } from "./ui/controls"

// Initialize Sentry
Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	environment: import.meta.env.VITE_ENVIRONMENT,
	release: APP_VERSION,
	integrations: [
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration(),
	],
	tracesSampleRate: 1.0,
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,
})

let automaton: Automaton
let controls: Controls

const reset = async (): Promise<void> => {
	// Cleanup existing automaton
	Automaton.cleanup(automaton)
	automaton = undefined

	// Get canvas and dimensions
	const canvasEl = document.getElementById("canvas") as HTMLCanvasElement
	const width = window.innerWidth
	const height = window.innerHeight

	// Create new automaton
	const settings = controls.getSettings()
	automaton = await Automaton.create(canvasEl, width, height, settings)
	controls.setAutomaton(automaton)
}

window.onload = () => {
	controls = new Controls(() => void reset())
	void reset()
}

window.onresize = () => void reset()
