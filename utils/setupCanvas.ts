export const setupCanvas = (
	canvasEl: HTMLCanvasElement,
	width: number,
	height: number,
): CanvasRenderingContext2D => {
	canvasEl.width = width
	canvasEl.height = height
	canvasEl.style.margin = "auto"

	const ctx = canvasEl.getContext("2d")
	if (!ctx) throw new Error("Could not get 2D context")

	const img = new Image()
	ctx.drawImage(img, 0, 0)

	return ctx
}
