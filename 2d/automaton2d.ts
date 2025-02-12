import type { Cell } from "../types/Cell"
import type { RGB } from "../types/RGB"
import { pickColors } from "../utils/pickColors"
import { randomInt } from "../utils/randomInt"
import { setupCanvas } from "../utils/setupCanvas"

export abstract class Automaton2D {
	protected canvasEl: HTMLCanvasElement
	protected width: number
	protected height: number
	protected resolution: number
	protected colorsCount: number
	protected rowsCount: number
	protected colsCount: number
	protected colors: Cell[]
	protected state: Cell[][]
	protected ctx: CanvasRenderingContext2D
	protected gl: WebGLRenderingContext
	protected stateTextures: [WebGLTexture, WebGLTexture]
	protected currentTextureIndex: number = 0
	private framebuffers: [WebGLFramebuffer, WebGLFramebuffer]
	private vertexShader: WebGLShader
	private fragmentShader: WebGLShader
	private shaderProgram: WebGLProgram
	private resolutionLocation: WebGLUniformLocation
	private stateLocation: WebGLUniformLocation
	renderInterval: NodeJS.Timer

	constructor(
		canvasEl: HTMLCanvasElement,
		width: number,
		height: number,
		resolution: number,
		colorsCount = 2,
		paletteColors?: RGB[],
	) {
		// Initialize colors first
		this.colors = pickColors(colorsCount, paletteColors)
		this.colorsCount = colorsCount

		// Then initialize other properties
		this.clear()
		this.canvasEl = canvasEl
		this.width = Math.floor(width / resolution)
		this.height = Math.floor(height / resolution)
		this.resolution = resolution
		this.rowsCount = this.height
		this.colsCount = this.width
		this.state = []

		// Initialize state before WebGL setup
		this.setRandomState()

		// Try WebGL first, fall back to Canvas
		this.gl = canvasEl.getContext('webgl')
		if (this.gl) {
			this.setupWebGL()
		} else {
			this.ctx = setupCanvas(this.canvasEl, width, height)
		}

		this.render()
	}

	private setupWebGL(): void {
		this.gl.viewport(0, 0, this.width * this.resolution, this.height * this.resolution)
		this.gl.clearColor(0, 0, 0, 1)

		// Vertex shader for full-screen quad
		const vertexShaderSource = `
			attribute vec2 a_position;
			void main() {
				gl_Position = vec4(a_position, 0.0, 1.0);
			}
		`

		// Fragment shader for 2D cellular automaton
		const fragmentShaderSource = `
			precision mediump float;
			uniform sampler2D u_state;
			uniform vec2 u_resolution;
			
			void main() {
				vec2 coord = gl_FragCoord.xy / u_resolution;
				vec4 state = texture2D(u_state, coord);
				gl_FragColor = state;
			}
		`

		// Create and compile shaders
		this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource)
		this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource)
		
		// Create and link program
		this.shaderProgram = this.gl.createProgram()
		this.gl.attachShader(this.shaderProgram, this.vertexShader)
		this.gl.attachShader(this.shaderProgram, this.fragmentShader)
		this.gl.linkProgram(this.shaderProgram)

		// Create vertices for full-screen quad
		const positions = new Float32Array([
			-1.0, -1.0,
			 1.0, -1.0,
			-1.0,  1.0,
			 1.0,  1.0,
		])
		
		const positionBuffer = this.gl.createBuffer()
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
		this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW)

		// Set up attributes and uniforms
		const positionLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_position')
		this.gl.enableVertexAttribArray(positionLocation)
		this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0)

		// Get uniform locations
		this.resolutionLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_resolution')
		this.stateLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_state')

		// Create ping-pong textures and framebuffers
		this.stateTextures = [
			this.createStateTexture(),
			this.createStateTexture()
		]
		this.framebuffers = [
			this.createFramebuffer(this.stateTextures[0]),
			this.createFramebuffer(this.stateTextures[1])
		]

		// Initialize first texture with state
		this.updateTextureFromState(this.stateTextures[0])
	}

	private createFramebuffer(texture: WebGLTexture): WebGLFramebuffer {
		const framebuffer = this.gl.createFramebuffer()
		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer)
		this.gl.framebufferTexture2D(
			this.gl.FRAMEBUFFER,
			this.gl.COLOR_ATTACHMENT0,
			this.gl.TEXTURE_2D,
			texture,
			0
		)
		return framebuffer
	}

	private createStateTexture(): WebGLTexture {
		const texture = this.gl.createTexture()
		this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
		
		// Create empty texture with correct dimensions
		this.gl.texImage2D(
			this.gl.TEXTURE_2D,
			0,
			this.gl.RGBA,
			this.width,
			this.height,
			0,
			this.gl.RGBA,
			this.gl.UNSIGNED_BYTE,
			null
		)

		// Set texture parameters
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT)

		return texture
	}

	protected updateTextureFromState(texture: WebGLTexture): void {
		const textureData = new Uint8Array(this.width * this.height * 4)
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const color = this.state[y][x].colorRgb
				const i = (y * this.width + x) * 4
				textureData[i] = color[0]
				textureData[i + 1] = color[1]
				textureData[i + 2] = color[2]
				textureData[i + 3] = 255
			}
		}

		this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
		this.gl.texImage2D(
			this.gl.TEXTURE_2D,
			0,
			this.gl.RGBA,
			this.width,
			this.height,
			0,
			this.gl.RGBA,
			this.gl.UNSIGNED_BYTE,
			textureData
		)
	}

	clear(): void {
		if (this.renderInterval) {
			clearInterval(this.renderInterval)
			this.renderInterval = undefined
		}
		if (this.ctx) {
			this.ctx.clearRect(0, 0, this.width * this.resolution, this.height * this.resolution)
		}
		this.setUniformState()
	}

	protected setUniformState = (): void => {
		// Initial empty state populating, create state AND render the canvas
		for (let y = 0; y < this.rowsCount; ++y) {
			for (let x = 0; x < this.colsCount; ++x) {
				if (!this.state[y]) this.state[y] = []
				this.state[y][x] = this.colors[0]
				
				// Only use fillSquare if we're in canvas mode
				if (this.ctx) {
					this.fillSquare(
						this.state[y][x].colorRgb,
						x * this.resolution,
						y * this.resolution,
					)
				}
			}
		}

		// If using WebGL, update the texture
		if (this.gl) {
			this.updateTextureFromState(this.stateTextures[0])
		}
	}

	protected setRandomState = (): void => {
		// Initial random populating, create state AND render the canvas
		for (let y = 0; y < this.rowsCount; ++y) {
			for (let x = 0; x < this.colsCount; ++x) {
				if (!this.state[y]) this.state[y] = []
				this.state[y][x] = this.colors[Math.floor(Math.random() * this.colors.length)]
				
				// Only use fillSquare if we're in canvas mode
				if (this.ctx) {
					this.fillSquare(
						this.state[y][x].colorRgb,
						x * this.resolution,
						y * this.resolution,
					)
				}
			}
		}

		// If using WebGL, update the texture
		if (this.gl) {
			this.updateTextureFromState(this.stateTextures[0])
		}
	}

	placePatternRandomly = (pattern: number[][]): void => {
		const posX = randomInt(0, this.colsCount - pattern[0].length) // Adjusted to ensure pattern fits within the grid
		const posY = randomInt(0, this.rowsCount - pattern.length) // Adjusted to ensure pattern fits within the grid
		// Place the pattern at the specified position
		for (let y = 0; y < pattern.length; ++y) {
			for (let x = 0; x < pattern[y].length; ++x) {
				// Change state at the specified squares
				this.state[posY + y][posX + x] = this.colors[pattern[y][x]]
				// Change canvas pixels
				this.fillSquare(
					this.colors[pattern[y][x]].colorRgb,
					(posX + x) * this.resolution,
					(posY + y) * this.resolution,
				)
			}
		}
	}

	start = (intervalMs: number, maxIterations: number): void => {
		if (this.state.length > 0) {
			let i = 0
			this.renderInterval = setInterval(() => {
				if (++i === maxIterations) clearInterval(this.renderInterval)
				this.updateState()
			}, intervalMs)
		}
	}

	protected fillSquare = (
		colorRgb: [number, number, number],
		x: number,
		y: number,
	): void => {
		this.ctx.fillStyle = `rgb(${colorRgb[0]},${colorRgb[1]},${colorRgb[2]})`
		this.ctx.fillRect(x, y, this.resolution, this.resolution)
	}

	protected getCellColor = (x: number, y: number): Cell => {
		const modifiedX =
			x === -1 ? this.colsCount - 1 : x === this.colsCount ? 0 : x
		const modifiedY =
			y === -1 ? this.rowsCount - 1 : y === this.rowsCount ? 0 : y
		return this.state[modifiedY][modifiedX]
	}

	protected getNeighborsColors = (x: number, y: number): Cell[] => {
		return [
			this.getCellColor(x - 1, y - 1),
			this.getCellColor(x, y - 1),
			this.getCellColor(x + 1, y - 1),
			// Middle cells
			this.getCellColor(x - 1, y),
			this.getCellColor(x + 1, y),
			// Lower cells
			this.getCellColor(x - 1, y + 1),
			this.getCellColor(x, y + 1),
			this.getCellColor(x + 1, y + 1),
		]
	}

	protected render(): void {
		if (this.gl) {
			// WebGL rendering
			this.gl.clear(this.gl.COLOR_BUFFER_BIT)

			// Bind the current texture
			this.gl.activeTexture(this.gl.TEXTURE0)
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.stateTextures[this.currentTextureIndex])

			// Draw
			this.gl.useProgram(this.shaderProgram)
			this.gl.uniform2f(this.resolutionLocation, this.width * this.resolution, this.height * this.resolution)
			this.gl.uniform1i(this.stateLocation, 0)  // Tell shader to use texture unit 0
			this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
		} else {
			// Canvas fallback
			for (let y = 0; y < this.height; y++) {
				for (let x = 0; x < this.width; x++) {
					this.fillSquare(
						this.state[y][x].colorRgb,
						x * this.resolution,
						y * this.resolution
					)
				}
			}
		}
	}

	private createShader(type: number, source: string): WebGLShader {
		const shader = this.gl.createShader(type)
		this.gl.shaderSource(shader, source)
		this.gl.compileShader(shader)

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			const info = this.gl.getShaderInfoLog(shader)
			this.gl.deleteShader(shader)
			throw new Error('Shader compile error: ' + info)
		}

		return shader
	}

	protected updateState(): void {
		if (this.gl) {
			// Bind framebuffer for rendering to texture
			this.gl.bindFramebuffer(
				this.gl.FRAMEBUFFER,
				this.framebuffers[1 - this.currentTextureIndex]
			)

			// Use current texture as input
			this.gl.activeTexture(this.gl.TEXTURE0)
			this.gl.bindTexture(
				this.gl.TEXTURE_2D,
				this.stateTextures[this.currentTextureIndex]
			)

			// Render next state
			this.gl.useProgram(this.shaderProgram)
			this.gl.uniform2f(this.resolutionLocation, this.width, this.height)
			this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)

			// Swap textures
			this.currentTextureIndex = 1 - this.currentTextureIndex

			// Render to screen
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
			this.render()
		} else {
			// Canvas fallback - existing implementation
			const newState: Cell[][] = []
			for (let y = 0; y < this.rowsCount; ++y) {
				newState[y] = []
				for (let x = 0; x < this.colsCount; ++x) {
					newState[y][x] = this.computeNextCellState(x, y)
				}
			}
			this.state = newState
			this.render()
		}
	}

	protected abstract computeNextCellState(x: number, y: number): Cell
}
