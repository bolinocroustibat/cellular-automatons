import type { ColorObject } from "../types/ColorObject"

export const nextCellColorId = (
	cell: ColorObject,
	colors: ColorObject[],
): number => {
	const cellId = cell.id
	if (cellId >= colors.length - 1) return 0
	return cellId + 1
}
