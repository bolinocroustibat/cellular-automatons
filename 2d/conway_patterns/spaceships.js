import { randomInt } from "../../utils/randomInt"

// Spaceships patterns

export const addGlider = (automaton) => {
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
	automaton.placePatternRandomly(gliderPattern)
}

export const addLWSS = (automaton) => {
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
	automaton.placePatternRandomly(lwssPattern)
}

export const addMWSS = (automaton) => {
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
	automaton.placePatternRandomly(mwssPattern)
}

export const addHWSS = (automaton) => {
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
	automaton.placePatternRandomly(hwssPattern)
}
