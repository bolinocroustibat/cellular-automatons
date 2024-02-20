import { placePatternRandomly } from "../index"

// Oscillator patterns

export const addBlinker = (context) => {
	const r = Math.random()
	if (r < 0.5) {
		const horizontalBlinkerPattern = [[1, 1, 1]]
		return placePatternRandomly(context, horizontalBlinkerPattern)
	}
	const verticalBlinkerPattern = [[1], [1], [1]]
	return placePatternRandomly(context, verticalBlinkerPattern)
}

export const addBeacon = (context) => {
	const r = Math.random()
	if (r < 0.5) {
		const beaconPattern = [
			[1, 1, 0, 0],
			[1, 1, 0, 0],
			[0, 0, 1, 1],
			[0, 0, 1, 1],
		]
		return placePatternRandomly(context, beaconPattern)
	}
	const beaconPattern = [
		[0, 0, 1, 1],
		[0, 0, 1, 1],
		[1, 1, 0, 0],
		[1, 1, 0, 0],
	]
	return placePatternRandomly(context, beaconPattern)
}

export const addPulsar = (context) => {
	const pulsarPattern = [
		[0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
		[0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
		[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
	]
	return placePatternRandomly(context, pulsarPattern)
}

export const addPentadecathlon = (context) => {
	const r = Math.random()
	if (r < 0.5) {
		const horizontalPentadecathlonPattern = [
			[0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
			[1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
			[0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
		]
		return placePatternRandomly(context, horizontalPentadecathlonPattern)
	}
	const verticalPentadecathlonPattern = [
		[0, 1, 0],
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 0],
		[0, 1, 0],
	]
	return placePatternRandomly(context, verticalPentadecathlonPattern)
}
