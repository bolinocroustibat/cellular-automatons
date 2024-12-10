import * as THREE from "three"
import type { ColorObject } from "../types/ColorObject"
import { nextCellColorId } from "../utils/nextCellColorId"
import { pickColors } from "../utils/pickColors"
import { setupCanvas } from "../utils/setupCanvas"

export class CCA3D {
	private canvasEl: HTMLCanvasElement
	private width: number
	private height: number
	private cubeWidth: number
	private cubeHeight: number
	private cubeDepth: number
	private cubeSize: number
	private threshold: number
	private colorsCount: number
	private colors: ColorObject[]
	private state: ColorObject[][][]
	private ctx: CanvasRenderingContext2D
	private scene: THREE.Scene
	renderInterval: NodeJS.Timer
	private camera: THREE.PerspectiveCamera
	private renderer: THREE.WebGLRenderer

	constructor(
		canvasEl: HTMLCanvasElement,
		width: number,
		height: number,
		cubeWidth: number,
		cubeHeight: number,
		cubeDepth: number,
		threshold: number,
		colorsCount: number,
	) {
		this.canvasEl = canvasEl
		this.width = width
		this.height = height
		this.cubeWidth = 20
		this.cubeHeight = 20
		this.cubeDepth = 20
		this.cubeSize = 5
		this.threshold = threshold
		this.colorsCount = colorsCount
		this.colors = pickColors(colorsCount)
		this.state = []
		this.ctx = setupCanvas(this.canvasEl, this.width, this.height)
		this.scene = new THREE.Scene()

		// Calculate the center of the cube structure
		const centerX = (this.cubeWidth * this.cubeSize) / 2
		const centerY = (this.cubeHeight * this.cubeSize) / 2
		const centerZ = (this.cubeDepth * this.cubeSize) / 2

		// Set up camera
		this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
		this.camera.position.set(0, 0, 300) // Position camera on Z axis only
		this.camera.lookAt(0, 0, 0) // Look at center

		// Center the scene
		this.scene.position.set(-centerX, -centerY, -centerZ)

		// Initialize renderer
		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setSize(this.width, this.height)
		this.canvasEl.replaceWith(this.renderer.domElement)
		this.renderer.render(this.scene, this.camera)

		// Start animating
		const animate = () => {
			requestAnimationFrame(animate)

			// Rotate the scene
			this.scene.rotation.x += 0.002
			this.scene.rotation.y += 0.002
			this.scene.rotation.z += 0.002
			this.renderer.render(this.scene, this.camera)
		}
		animate()

		// DEBUG: add axes
		const axesHelper = new THREE.AxesHelper(5)
		this.scene.add(axesHelper)

		// Initial random populating
		this.setRandomStateAndRender()
		// this.render(0)
	}

	setRandomStateAndRender = (): void => {
		for (let z = 0; z < this.cubeDepth; z++) {
			this.state[z] = []
			for (let y = 0; y < this.cubeHeight; y++) {
				this.state[z][y] = []
				for (let x = 0; x < this.cubeWidth; x++) {
					this.state[z][y][x] =
						this.colors[Math.floor(Math.random() * this.colors.length)]
					this.fillCube(this.state[z][y][x].colorRgb, x, y, z)
				}
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

	updateState = (): void => {
		const newState: ColorObject[][][] = []
		for (let z = 0; z < this.cubeDepth; z++) {
			for (let y = 0; y < this.cubeHeight; y++) {
				for (let x = 0; x < this.cubeWidth; x++) {
					const neighbours = this.getNeighbours(x, y, z)
					const nextColorId = nextCellColorId(this.state[z][y][x], this.colors)
					const successorNeighboursCount = neighbours.filter(
						(neighbour) => neighbour.id === nextColorId,
					)
					newState[z][y][x] =
						successorNeighboursCount.length >= 1
							? successorNeighboursCount[0]
							: this.state[z][y][x]
					this.fillCube(newState[z][y][x].colorRgb, x, y, z)
				}
			}
		}
		this.state = newState
	}

	private getNeighbours(x: number, y: number, z: number): ColorObject[] {
		const neighbours: ColorObject[] = []
		for (let dz = -1; dz <= 1; dz++) {
			for (let dy = -1; dy <= 1; dy++) {
				for (let dx = -1; dx <= 1; dx++) {
					if (dx === 0 && dy === 0 && dz === 0) continue
					neighbours.push(this.getCellColor(x + dx, y + dy, z + dz))
				}
			}
		}
		return neighbours
	}

	private getCellColor(x: number, y: number, z: number): ColorObject {
		const modifiedX = (x + this.cubeWidth) % this.cubeWidth
		const modifiedY = (y + this.cubeHeight) % this.cubeHeight
		const modifiedZ = (z + this.cubeDepth) % this.cubeDepth
		return this.state[modifiedZ][modifiedY][modifiedX]
	}

	private fillCube(
		colorRgb: [number, number, number],
		x: number,
		y: number,
		z: number,
	): void {
		const geometry = new THREE.BoxGeometry(
			this.cubeSize,
			this.cubeSize,
			this.cubeSize,
		)
		const material = new THREE.MeshBasicMaterial({
			color: `rgb(${colorRgb[0]},${colorRgb[1]},${colorRgb[2]})`,
			transparent: true,
			opacity: 0.5
		})
		const cell = new THREE.Mesh(geometry, material)
		cell.position.set(x * this.cubeSize, y * this.cubeSize, z * this.cubeSize)
		this.scene.add(cell)
	}

	render = (): void => {
		this.renderer.render(this.scene, this.camera) // Render the scene
		for (let z = 0; z < this.cubeDepth; z++) {
			for (let y = 0; y < this.cubeHeight; y++) {
				for (let x = 0; x < this.cubeWidth; x++) {
					this.fillCube(this.state[z][y][x].colorRgb, x, y, z)
				}
			}
		}
	}
}
