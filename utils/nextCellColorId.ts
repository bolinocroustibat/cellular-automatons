import type { Cell } from "../types/Cell"

export const nextCellColorId = (cell: Cell, colors: Cell[]): number => {
	const cellId = cell.id
	if (cellId >= colors.length - 1) return 0
	return cellId + 1
}
