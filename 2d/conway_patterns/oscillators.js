// Oscillator patterns

export const addBlinker = (automaton) => {
	const r = Math.random()
	if (r < 0.5) {
		const horizontalBlinkerPattern = [[1, 1, 1]]
		automaton.placePatternRandomly(horizontalBlinkerPattern)
	} else {
		const verticalBlinkerPattern = [[1], [1], [1]]
		automaton.placePatternRandomly(verticalBlinkerPattern)
	}
}

export const addBeacon = (automaton) => {
	const r = Math.random()
	if (r < 0.5) {
		const beaconPattern = [
			[1, 1, 0, 0],
			[1, 1, 0, 0],
			[0, 0, 1, 1],
			[0, 0, 1, 1],
		]
		automaton.placePatternRandomly(beaconPattern)
	} else {
		const beaconPattern = [
			[0, 0, 1, 1],
			[0, 0, 1, 1],
			[1, 1, 0, 0],
			[1, 1, 0, 0],
		]
		automaton.placePatternRandomly(beaconPattern)
	}
}

export const addPulsar = (automaton) => {
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
	automaton.placePatternRandomly(pulsarPattern)
}

export const addPentadecathlon = (automaton) => {
	const r = Math.random()
	if (r < 0.5) {
		const horizontalPentadecathlonPattern = [
			[0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
			[1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
			[0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
		]
		automaton.placePatternRandomly(horizontalPentadecathlonPattern)
	} else {
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
		automaton.placePatternRandomly(verticalPentadecathlonPattern)
	}
}
