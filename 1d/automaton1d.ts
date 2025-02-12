import type { Cell } from "../types/Cell"
import type { RGB } from "../types/RGB"
import { pickColors } from "../utils/pickColors"
import { setupCanvas } from "../utils/setupCanvas"

export abstract class Automaton1D {
	// 1. Properties
	protected canvasEl: HTMLCanvasElement
	protected width: number
	protected height: number
	protected colors: Cell[]
	protected state: Cell[]
	protected ctx: CanvasRenderingContext2D
	protected gl: WebGLRenderingContext
	renderInterval: NodeJS.Timer
	private vertexShader: WebGLShader
	private fragmentShader: WebGLShader
	private shaderProgram: WebGLProgram
	private stateTexture: WebGLTexture
	private resolutionLocation: WebGLUniformLocation
	private lineLocation: WebGLUniformLocation
	private stateLocation: WebGLUniformLocation

	// 2. Constructor
	constructor(
		canvasEl: HTMLCanvasElement,
		width: number,
		height: number,
		colorsCount: number,
		paletteColors?: RGB[],
	) {
		this.clear()
		this.canvasEl = canvasEl

		// Set canvas size to match window dimensions
		this.canvasEl.width = width
		this.canvasEl.height = height
		
		this.width = width
		this.height = height
		this.colors = pickColors(colorsCount, paletteColors)
		this.state = []

		// Try WebGL first, fall back to Canvas
		this.gl = canvasEl.getContext('webgl')
		if (this.gl) {
			this.setupWebGL()
		} else {
			this.ctx = setupCanvas(this.canvasEl, width, height)
		}

		this.setRandomState()
		this.render(0)
	}

	clear = (): void => {
		if (this.renderInterval) {
			clearInterval(this.renderInterval)
			this.renderInterval = undefined
		}
		if (this.ctx) {
			this.ctx.clearRect(0, 0, this.width, this.height)
		}
	}

	start = (intervalMs: number): void => {
		let line = 0
		this.renderInterval = setInterval(() => {
			if (++line === this.height) clearInterval(this.renderInterval)
			this.update(line)
		}, intervalMs)
	}

	protected abstract update(line: number): void

	protected render = (line: number): void => {
		if (this.gl) {
			// WebGL rendering
			const textureData = new Uint8Array(this.width * 4)
			for (let x = 0; x < this.width; x++) {
				const color = this.state[x].colorRgb
				textureData[x * 4] = color[0]
				textureData[x * 4 + 1] = color[1]
				textureData[x * 4 + 2] = color[2]
				textureData[x * 4 + 3] = 255
			}

			this.gl.activeTexture(this.gl.TEXTURE0)
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.stateTexture)
			this.gl.texSubImage2D(
				this.gl.TEXTURE_2D,
				0,
				0,
				line,
				this.width,
				1,
				this.gl.RGBA,
				this.gl.UNSIGNED_BYTE,
				textureData
			)

			this.gl.useProgram(this.shaderProgram)
			this.gl.uniform2f(this.resolutionLocation, this.width, this.height)
			this.gl.uniform1f(this.lineLocation, line)
			this.gl.uniform1i(this.stateLocation, 0)

			this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
		} else {
			// Canvas fallback
			for (let x = 0; x < this.width; x++) {
				this.fillPixel(this.state[x].colorRgb, x, line)
			}
		}
	}

	protected setRandomState = (): void => {
		if (!this.state) this.state = []
		for (let x = 0; x < this.width; x++) {
			const randomColor =
				this.colors[Math.floor(Math.random() * this.colors.length)]
			this.state[x] = randomColor
		}
	}

	protected getCellColor = (x: number): Cell => {
		const modifiedX = x === -1 ? this.width - 1 : x === this.width ? 0 : x
		return this.state[modifiedX]
	}

	protected fillPixel = (
		colorRgb: [number, number, number],
		x: number,
		y: number,
	): void => {
		this.ctx.fillStyle = `rgb(${colorRgb[0]},${colorRgb[1]},${colorRgb[2]})`
		this.ctx.fillRect(x, y, 1, 1)
	}

	private setupWebGL(): void {
		// Add at the beginning of setupWebGL
		this.gl.viewport(0, 0, this.width, this.height)
		this.gl.clearColor(0, 0, 0, 1)

		// Vertex shader - positions our line vertices
		const vertexShaderSource = `
			attribute vec2 a_position;
			void main() {
				gl_Position = vec4(a_position, 0.0, 1.0);
			}
		`

		// Updated fragment shader to preserve previous lines
		const fragmentShaderSource = `
			precision mediump float;
			uniform sampler2D u_state;
			uniform vec2 u_resolution;
			uniform float u_line;
			
			void main() {
				vec2 coord = gl_FragCoord.xy / u_resolution;
				float y = gl_FragCoord.y;
				
				if (y > u_line) {
					discard;  // Don't render future lines
				} else if (y > u_line - 1.0) {
					// Current line - get color from state texture
					vec2 texCoord = vec2(coord.x, 0.0);
					gl_FragColor = texture2D(u_state, texCoord);
				} else {
					// Previous lines - keep existing color
					gl_FragColor = texture2D(u_state, coord);
				}
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

		// Create a buffer for the line vertices
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
		this.lineLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_line')
		this.stateLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_state')

		// Create and set up texture for state - make it full height
		this.stateTexture = this.gl.createTexture()
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.stateTexture)
		this.gl.texImage2D(
			this.gl.TEXTURE_2D,
			0,
			this.gl.RGBA,
			this.width,
			this.height,  // Make texture full height
			0,
			this.gl.RGBA,
			this.gl.UNSIGNED_BYTE,
			null  // Initialize empty
		)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
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
}
