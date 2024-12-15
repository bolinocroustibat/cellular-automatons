export interface AutomatonBase {
	renderInterval: NodeJS.Timer
	start: (fps: number, maxIterations?: number) => void
	clear?: () => void
	placePatternRandomly?: (pattern: number[][]) => void
}
