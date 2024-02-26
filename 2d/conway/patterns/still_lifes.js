// Still Lifes patterns

export const addBlock = (automaton) => {
	const loafPattern = [
		[1, 1],
		[0, 0],
	]
	automaton.placePatternRandomly(loafPattern)
}

export const addLoaf = (automaton) => {
	const loafPattern = [
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 0, 1],
		[0, 0, 1, 0],
	]
	automaton.placePatternRandomly(loafPattern)
}

export const addBoat = (automaton) => {
	const boatPattern = [
		[1, 1, 0],
		[1, 0, 1],
		[0, 1, 0],
	]
	automaton.placePatternRandomly(boatPattern)
}

export const addBeehive = (automaton) => {
	const beehivePattern = [
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
	]
	automaton.placePatternRandomly(beehivePattern)
}
