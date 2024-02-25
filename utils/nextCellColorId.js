export const nextCellColorId = (cell, colors) => {
	const cellId = cell.id
	if (cellId >= colors.length - 1) return 0
	return cellId + 1
}
