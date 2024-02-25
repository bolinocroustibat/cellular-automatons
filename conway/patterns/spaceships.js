import { randomInt } from "../../utils/randomInt"
import { placePatternRandomly } from "../index"

// Spaceships patterns

export const addGlider = (context) => {
	let gliderPattern = null
	const r = randomInt(1, 4)
	switch (r) {
		case 1:
			gliderPattern = [
				[0, 1, 0],
				[0, 0, 1],
				[1, 1, 1],
			]
			break
		case 2:
			gliderPattern = [
				[1, 1, 1],
				[1, 0, 0],
				[0, 1, 0],
			]
			break
		case 3:
			gliderPattern = [
				[0, 0, 1],
				[1, 1, 0],
				[0, 1, 1],
			]
			break
		case 4:
			gliderPattern = [
				[1, 1, 0],
				[0, 1, 1],
				[1, 0, 0],
			]
			break
	}
	return placePatternRandomly(context, gliderPattern)
}

export const addLWSS = (context) => {
	let lwssPattern = null
	const r = randomInt(1, 4)
	switch (r) {
		case 1:
			lwssPattern = [
				[0, 1, 0, 0, 1],
				[1, 0, 0, 0, 0],
				[1, 0, 0, 0, 1],
				[1, 1, 1, 1, 0],
			]
			break
		case 2:
			lwssPattern = [
				[1, 0, 0, 1, 0],
				[0, 0, 0, 0, 1],
				[1, 0, 0, 0, 1],
				[0, 1, 1, 1, 1],
			]
			break
		case 3:
			lwssPattern = [
				[0, 1, 0, 1],
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[1, 0, 0, 1],
				[1, 1, 1, 0],
			]
			break
		case 4:
			lwssPattern = [
				[1, 1, 1, 0],
				[1, 0, 0, 1],
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[0, 1, 0, 1],
			]
			break
	}
	return placePatternRandomly(context, lwssPattern)
}

export const addMWSS = (context) => {
	let mwssPattern = null
	const r = randomInt(1, 2)
	if (r === 1) {
		mwssPattern = [
			[0, 1, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0],
			[1, 0, 0, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 1, 0],
		]
	} else {
		mwssPattern = [
			[1, 0, 0, 0, 0, 1, 0],
			[0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 1],
			[0, 1, 1, 1, 1, 1, 1],
		]
	}
	return placePatternRandomly(context, mwssPattern)
}

export const addHWSS = (context) => {
	let hwssPattern = null
	const r = randomInt(1, 2)
	if (r === 1) {
		hwssPattern = [
			[0, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 1, 0],
			[0, 0, 1, 1, 0, 0, 0],
		]
	} else {
		hwssPattern = [
			[1, 1, 1, 1, 1, 1, 0],
			[1, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0],
			[0, 1, 0, 0, 0, 0, 1],
			[0, 0, 0, 1, 1, 0, 0],
		]
	}
	return placePatternRandomly(context, hwssPattern)
}
