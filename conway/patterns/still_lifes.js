import { placePatternRandomly } from "../index"

// Still Lifes patterns

export const addBlock = (context) => {
	const loafPattern = [
		[1, 1],
		[0, 0],
	]
	return placePatternRandomly(context, loafPattern)
}

export const addLoaf = (context) => {
	const loafPattern = [
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 0, 1],
		[0, 0, 1, 0],
	]
	return placePatternRandomly(context, loafPattern)
}

export const addBoat = (context) => {
	const boatPattern = [
		[1, 1, 0],
		[1, 0, 1],
		[0, 1, 0],
	]
	return placePatternRandomly(context, boatPattern)
}

export const addBeehive = (context) => {
	const beehivePattern = [
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[0, 1, 1, 0],
	]
	return placePatternRandomly(context, beehivePattern)
}
