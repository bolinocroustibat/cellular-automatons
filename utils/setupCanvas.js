export const setupCanvas = (canvasEl, width, height) => {
	canvasEl.width = width
	canvasEl.height = height
	canvasEl.style.width = `${width}px`
	canvasEl.style.height = `${height}px`
	canvasEl.style.margin = "auto"
	const ctx = canvasEl.getContext("2d")
	const img = new Image()
	ctx.drawImage(img, 0, 0)
	return ctx
}
