import { randomInt } from "../../../utils/randomInt"

// Spaceships patterns

export const gliderPattern = () => {
	const r = randomInt(1, 4)
	switch (r) {
		case 1:
			return [
				[0, 1, 0],
				[0, 0, 1],
				[1, 1, 1],
			]
		case 2:
			return [
				[1, 1, 1],
				[1, 0, 0],
				[0, 1, 0],
			]
		case 3:
			return [
				[0, 0, 1],
				[1, 1, 0],
				[0, 1, 1],
			]
		case 4:
			return [
				[1, 1, 0],
				[0, 1, 1],
				[1, 0, 0],
			]
	}
}

export const LWSSPattern = () => {
	const r = randomInt(1, 4)
	switch (r) {
		case 1:
			return [
				[0, 1, 0, 0, 1],
				[1, 0, 0, 0, 0],
				[1, 0, 0, 0, 1],
				[1, 1, 1, 1, 0],
			]
		case 2:
			return [
				[1, 0, 0, 1, 0],
				[0, 0, 0, 0, 1],
				[1, 0, 0, 0, 1],
				[0, 1, 1, 1, 1],
			]
		case 3:
			return [
				[0, 1, 0, 1],
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[1, 0, 0, 1],
				[1, 1, 1, 0],
			]
		case 4:
			return [
				[1, 1, 1, 0],
				[1, 0, 0, 1],
				[1, 0, 0, 0],
				[1, 0, 0, 0],
				[0, 1, 0, 1],
			]
	}
}

export const MWSSPattern = () => {
	const r = randomInt(1, 2)
	if (r === 1) {
		return [
			[0, 1, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0],
			[1, 0, 0, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 1, 0],
		]
	}
	return [
		[1, 0, 0, 0, 0, 1, 0],
		[0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 1],
		[0, 1, 1, 1, 1, 1, 1],
	]
}

export const HWSSPattern = () => {
	const r = randomInt(1, 2)
	if (r === 1) {
		return [
			[0, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 1, 0],
			[0, 0, 1, 1, 0, 0, 0],
		]
	}
	return [
		[1, 1, 1, 1, 1, 1, 0],
		[1, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0, 0, 1],
		[0, 0, 0, 1, 1, 0, 0],
	]
}
