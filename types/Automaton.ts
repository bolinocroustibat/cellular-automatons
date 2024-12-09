export interface AutomatonBase {
	renderInterval: number
	start: (fps: number, maxIterations?: number) => void
	clear: () => void
	placePatternRandomly?: (pattern: number[][]) => void
}
