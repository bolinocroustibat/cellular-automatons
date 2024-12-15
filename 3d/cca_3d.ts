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
	private cellSize: number
	private threshold: number
	private colors: ColorObject[]
	private state: ColorObject[][][]
	private rotationSpeed: number
	private scene: THREE.Scene
	renderInterval: NodeJS.Timer
	private camera: THREE.PerspectiveCamera
	private renderer: THREE.WebGLRenderer
	private frameCount: number
	private updateEveryNFrames: number

	constructor(
		canvasEl: HTMLCanvasElement,
		width: number,
		height: number,
		threshold: number,
		colorsCount: number,
	) {
		this.canvasEl = canvasEl
		this.width = width
		this.height = height
		this.cubeWidth = 15
		this.cubeHeight = 15
		this.cubeDepth = 15
		this.cellSize = 10
		this.threshold =4
		this.colors = pickColors(10)
		this.state = []
		this.rotationSpeed = 0.0015
		this.scene = new THREE.Scene()
		this.frameCount = 0
		this.updateEveryNFrames = 20

		// Set up camera
		this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
		this.camera.position.set(0, 0, 300) // Position camera on Z axis only
		this.camera.lookAt(0, 0, 0) // Look at center

		// Create a group to hold all cubes and center it
		const group = new THREE.Group()
		this.scene.add(group)
		this.scene = group // Make the group our new scene reference

		// Initialize renderer
		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setSize(this.width, this.height)
		this.canvasEl.replaceWith(this.renderer.domElement)
		this.renderer.render(this.scene, this.camera)

		// Initial random populating
		this.setRandomStateAndRender()

		// Start animating
		const animate = () => {
			requestAnimationFrame(animate)

			// Increment frame counter
			this.frameCount++

			// Rotate the scene
			this.scene.rotation.x += this.rotationSpeed
			this.scene.rotation.y += this.rotationSpeed
			this.scene.rotation.z += this.rotationSpeed

			// Update cube state every N frames
			if (this.frameCount % this.updateEveryNFrames === 0) {
				this.update()
			}

			// Render every frame
			this.renderer.render(this.scene, this.camera)
		}

		animate()

	}

	private setRandomStateAndRender = (): void => {
		for (let z = 0; z < this.cubeDepth; z++) {
			this.state[z] = []
			for (let y = 0; y < this.cubeHeight; y++) {
				this.state[z][y] = []
				for (let x = 0; x < this.cubeWidth; x++) {
					this.state[z][y][x] =
						this.colors[Math.floor(Math.random() * this.colors.length)]
					this.fillCell(this.state[z][y][x].colorRgb, x, y, z)
				}
			}
		}
	}

	private clearScene(): void {
		// Remove all meshes from the scene
		while (this.scene.children.length > 0) {
			const object = this.scene.children[0];
			if (object instanceof THREE.Mesh) {
				if (object.geometry) {
					object.geometry.dispose();
				}
				if (object.material) {
					if (Array.isArray(object.material)) {
						object.material.forEach(material => material.dispose());
					} else {
						object.material.dispose();
					}
				}
			}
			this.scene.remove(object);
		}
	}

	private update = (): void => {
		// Clear the scene before updating
		this.clearScene()

		// Initialize the new state array with proper structure
		const newState: ColorObject[][][] = Array(this.cubeDepth)
			.fill(null)
			.map(() =>
				Array(this.cubeHeight)
					.fill(null)
					.map(() => Array(this.cubeWidth).fill(null))
			)

		// Single loop to handle both state update and cell creation
		for (let z = 0; z < this.cubeDepth; z++) {
			for (let y = 0; y < this.cubeHeight; y++) {
				for (let x = 0; x < this.cubeWidth; x++) {
					const currentCell = this.state[z][y][x]
					const neighbours = this.getNeighbours(x, y, z)
					const nextColorId = nextCellColorId(currentCell, this.colors)

					// Count neighbors with the next color ID
					const successorNeighboursCount = neighbours.filter(
						(neighbour) => neighbour.id === nextColorId,
					).length

					// Update state based on threshold
					newState[z][y][x] = successorNeighboursCount >= this.threshold
						? this.colors.find(color => color.id === nextColorId)!
						: currentCell

					// Create all cells
					this.fillCell(newState[z][y][x].colorRgb, x, y, z);

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

	private fillCell(
		colorRgb: [number, number, number],
		x: number,
		y: number,
		z: number,
	): void {
		const geometry = new THREE.BoxGeometry(
			this.cellSize,
			this.cellSize,
			this.cellSize,
		)
		const material = new THREE.MeshBasicMaterial({
			color: `rgb(${colorRgb[0]},${colorRgb[1]},${colorRgb[2]})`,
			transparent: true,
			opacity: 0.5,
			depthWrite: false // This can help with transparency rendering
		})
		const cell = new THREE.Mesh(geometry, material)
		// Position relative to center
		const posX = (x - this.cubeWidth / 2) * this.cellSize
		const posY = (y - this.cubeHeight / 2) * this.cellSize
		const posZ = (z - this.cubeDepth / 2) * this.cellSize
		cell.position.set(posX, posY, posZ)
		this.scene.add(cell)
	}

}
