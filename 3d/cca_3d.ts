import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import type { Cell } from "../types/ Cell"
import { nextCellColorId } from "../utils/nextCellColorId"
import { pickColors } from "../utils/pickColors"

interface Cell3D extends Cell {
	mesh?: THREE.Mesh
}

export class CCA3D {
	private canvasEl: HTMLCanvasElement
	private width: number
	private height: number
	private cubeDimension: number
	private readonly halfCubeDimension: number
	private cellSize: number
	private cellFilling: number
	private threshold: number
	private colors: Cell[]
	private readonly colorMap: Map<number, Cell>
	private state: Cell3D[][][]
	private bufferState: Cell3D[][][]
	private initialRotationSpeed: number
	private rotationDirectionX: number
	private rotationDirectionY: number
	private rotationDirectionZ: number
	private scene: THREE.Scene
	private cellGroup: THREE.Group
	private camera: THREE.PerspectiveCamera
	private controls: OrbitControls
	private isUserInteracting = false
	private renderer: THREE.WebGLRenderer
	private animationFrameId?: number
	private animationFrameCount = 0
	renderInterval: NodeJS.Timer

	constructor(
		canvasEl: HTMLCanvasElement,
		width: number,
		height: number,
		resolution: number,
		threshold: number,
		colorsCount: number,
	) {
		// Clean everything
		this.clear()

		this.canvasEl = canvasEl
		this.width = width
		this.height = height
		this.cubeDimension = resolution
		this.cellSize = Math.min(width, height) / resolution / 4
		this.cellFilling = 1.0
		this.threshold = threshold // 4 is good
		this.colors = pickColors(colorsCount) // 10 is good
		this.state = []
		this.bufferState = []
		this.initialRotationSpeed = 0.004

		// Pre-calculate values that are used often for performance
		this.halfCubeDimension = this.cubeDimension / 2
		this.colorMap = new Map(this.colors.map((color) => [color.id, color]))

		// Initialize scene first
		this.scene = new THREE.Scene()

		// Create group for cells and center it
		this.cellGroup = new THREE.Group()
		this.cellGroup.position.set(0, 0, 0)
		this.scene.add(this.cellGroup)

		// Set up camera
		this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
		this.camera.position.set(200, 200, 300)
		this.camera.lookAt(0, 0, 0) // Look at center

		// Initialize renderer
		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setSize(this.width, this.height)

		// Replace the canvas with renderer's domElement
		if (this.canvasEl) {
			this.canvasEl.replaceWith(this.renderer.domElement)
		}

		// Add OrbitControls
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		this.controls.enableDamping = true // Add smooth damping
		this.controls.dampingFactor = 0.05
		this.controls.rotateSpeed = 0.5

		// Add event listeners for user interaction
		this.controls.addEventListener("start", () => {
			this.isUserInteracting = true
		})

		// Initial random populating
		this.setInitialState()

		// Initial render
		this.renderer.render(this.scene, this.camera)

		// Initialize random rotation directions
		this.setRandomRotationDirections()

		// Animate
		this.animate()
	}

	clear = (): void => {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId)
			this.animationFrameId = undefined
		}

		if (this.renderInterval) {
			clearInterval(this.renderInterval)
		}

		if (this.cellGroup) {
			this.cellGroup.traverse((object) => {
				if (object instanceof THREE.Mesh) {
					object.geometry.dispose()
					if (Array.isArray(object.material)) {
						for (const material of object.material) {
							material.dispose()
						}
					} else {
						object.material.dispose()
					}
				}
			})
		}

		if (this.scene) {
			this.scene.remove(this.cellGroup)
		}

		if (this.renderer) {
			this.renderer.dispose()
			const rendererDomElement = this.renderer.domElement
			if (rendererDomElement.parentElement) {
				const newCanvas = document.createElement("canvas")
				newCanvas.id = "canvas"
				rendererDomElement.parentElement.replaceChild(
					newCanvas,
					rendererDomElement,
				)
			}
		}
	}

	private setRandomRotationDirections(): void {
		// Will be either 1 or -1 for each axis
		this.rotationDirectionX = Math.random() < 0.5 ? 1 : -1
		this.rotationDirectionY = Math.random() < 0.5 ? 1 : -1
		this.rotationDirectionZ = Math.random() < 0.5 ? 1 : -1
	}

	private animate = (): void => {
		this.animationFrameId = requestAnimationFrame(this.animate)

		// Update controls
		this.controls.update()

		// Increment frame counter
		this.animationFrameCount++

		// Only apply automatic rotation if user is not interacting
		if (!this.isUserInteracting) {
			this.cellGroup.rotation.x +=
				this.initialRotationSpeed * this.rotationDirectionX
			this.cellGroup.rotation.y +=
				this.initialRotationSpeed * this.rotationDirectionY
			this.cellGroup.rotation.z +=
				this.initialRotationSpeed * this.rotationDirectionZ
		}

		// Render every frame
		this.renderer.render(this.scene, this.camera)
	}

	start = (stateUpdatesPerSecond: number): void => {
		// Clear any existing interval
		if (this.renderInterval) {
			clearInterval(this.renderInterval)
		}

		const intervalMs = 1000 / stateUpdatesPerSecond
		this.renderInterval = setInterval(() => {
			this.update()
		}, intervalMs)
	}

	private setInitialState = (): void => {
		// Initialize both state arrays
		for (let z = 0; z < this.cubeDimension; z++) {
			this.state[z] = []
			this.bufferState[z] = []
			for (let y = 0; y < this.cubeDimension; y++) {
				this.state[z][y] = []
				this.bufferState[z][y] = []
				for (let x = 0; x < this.cubeDimension; x++) {
					const randomColor =
						this.colors[Math.floor(Math.random() * this.colors.length)]
					const cell = this.createCell(randomColor, x, y, z, false)
					this.state[z][y][x] = cell
					// Initialize buffer with same properties but without mesh
					this.bufferState[z][y][x] = { ...cell }
				}
			}
		}
	}

	private createCell(
		colorObj: Cell,
		x: number,
		y: number,
		z: number,
		wireframe: boolean,
	): Cell3D {
		const geometry = new THREE.BoxGeometry(
			this.cellSize * this.cellFilling,
			this.cellSize * this.cellFilling,
			this.cellSize * this.cellFilling,
		)

		const material = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.1,
			depthWrite: false,
			// side: THREE.DoubleSide,  // Render both sides of faces
		})

		const mesh = new THREE.Mesh(geometry, material)

		if (wireframe) {
			// Add wireframe
			const wireframeGeometry = new THREE.EdgesGeometry(geometry)
			const wireframeMaterial = new THREE.LineBasicMaterial({
				color: 0xffffff,
				transparent: true,
				opacity: 0.2,
			})
			const wireframe = new THREE.LineSegments(
				wireframeGeometry,
				wireframeMaterial,
			)
			mesh.add(wireframe)
		}

		this.updateCellColor(mesh, colorObj.colorRgb)

		const posX = (x - this.halfCubeDimension) * this.cellSize
		const posY = (y - this.halfCubeDimension) * this.cellSize
		const posZ = (z - this.halfCubeDimension) * this.cellSize

		mesh.position.set(posX, posY, posZ)
		this.cellGroup.add(mesh)

		// Simply return the combined object
		return {
			...colorObj,
			mesh,
		}
	}

	private updateCellColor(mesh: THREE.Mesh, colorRgb: number[]): void {
		// Type check only once
		if (mesh.material instanceof THREE.Material) {
			// Pre-calculate RGB values once
			const r = colorRgb[0] / 255
			const g = colorRgb[1] / 255
			const b = colorRgb[2] / 255
			mesh.material.color.setRGB(r, g, b)
		}
	}

	private update = (): void => {
		for (let z = 0; z < this.cubeDimension; z++) {
			for (let y = 0; y < this.cubeDimension; y++) {
				for (let x = 0; x < this.cubeDimension; x++) {
					const currentCell = this.state[z][y][x]
					const nextColorId = nextCellColorId(currentCell, this.colors)
					const successorNeighboursCount = this.getNeighbours(x, y, z).filter(
						(neighbour) => neighbour.id === nextColorId,
					).length

					if (successorNeighboursCount >= this.threshold) {
						const newColor = this.colorMap.get(nextColorId) ?? currentCell

						// Update the buffer state
						this.bufferState[z][y][x] = {
							...newColor,
							mesh: currentCell.mesh,
						}

						// Update the visual if color changed
						if (newColor.id !== currentCell.id && currentCell.mesh) {
							// Use the utility method instead of inline color update
							this.updateCellColor(currentCell.mesh, newColor.colorRgb)
						}
					} else {
						// Keep the same state
						this.bufferState[z][y][x] = currentCell
					}
				}
			}
		}
		// Swap buffers
		;[this.state, this.bufferState] = [this.bufferState, this.state]
	}

	private getNeighbours(x: number, y: number, z: number): Cell[] {
		const neighbours: Cell[] = []
		const offsets = [-1, 0, 1]
		for (const dz of offsets) {
			for (const dy of offsets) {
				for (const dx of offsets) {
					if (dx === 0 && dy === 0 && dz === 0) continue
					neighbours.push(this.getCellColor(x + dx, y + dy, z + dz))
				}
			}
		}
		return neighbours
	}

	private getCellColor(x: number, y: number, z: number): Cell {
		const modifiedX = (x + this.cubeDimension) % this.cubeDimension
		const modifiedY = (y + this.cubeDimension) % this.cubeDimension
		const modifiedZ = (z + this.cubeDimension) % this.cubeDimension
		return this.state[modifiedZ][modifiedY][modifiedX]
	}
}
