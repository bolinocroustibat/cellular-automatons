export const setupCanvas = (canvasEl, width, height) => {
	/**
	 * @param {HTMLCanvasElement} canvasEl
	 * @param {number} width
	 * @param {number} height
	 * https://stackoverflow.com/questions/4938346/canvas-width-and-height-in-html5
	 * If you don't set the CSS attributes, the intrinsic size of the canvas will be used as its display size; if you do set the CSS attributes, and they differ from the canvas dimensions, your content will be scaled in the browser.
	 **/
	canvasEl.width = width
	canvasEl.height = height
	canvasEl.style.margin = "auto"
	const ctx = canvasEl.getContext("2d")
	const img = new Image()
	ctx.drawImage(img, 0, 0)
	return ctx
}
