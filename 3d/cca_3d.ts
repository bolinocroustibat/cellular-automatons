import * as THREE from "three"
import type { Cell } from "../types/ Cell"
import { nextCellColorId } from "../utils/nextCellColorId"
import { pickColors } from "../utils/pickColors"

interface Cell3D extends Cell {
	mesh?: THREE.Mesh;
}

export class CCA3D {
	private canvasEl: HTMLCanvasElement
	private width: number
	private height: number
	private cubeWidth: number
	private cubeHeight: number
	private cubeDepth: number
	private cellSize: number
	private threshold: number
	private colors:  Cell[]
	private state: Cell3D[][][]
	private rotationSpeed: number
	private scene: THREE.Scene
	renderInterval: NodeJS.Timer
	private camera: THREE.PerspectiveCamera
	private renderer: THREE.WebGLRenderer
	private frameCount: number
	private updateEveryNFrames: number
	// Timer
	private lastFrameTime: number = performance.now();

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
		this.cubeWidth = 22
		this.cubeHeight = 22
		this.cubeDepth = 22
		this.cellSize = 10
		this.threshold = 3
		this.colors = pickColors(10)
		this.state = []
		this.rotationSpeed = 0.004
		this.scene = new THREE.Scene()
		this.frameCount = 0
		this.updateEveryNFrames = 2

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
		this.setInitialState()

		// Start animating
		const animate = () => {
			const currentTime = performance.now();
			const frameTime = currentTime - this.lastFrameTime;
			this.lastFrameTime = currentTime;

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

			// Log performance every N frames
			if (this.frameCount % this.updateEveryNFrames === 0) {
				console.clear();
				console.log(`Frame time: ${frameTime.toFixed(2)}ms`)
			}
		}

		animate()

	}

	private setInitialState = (): void => {
		for (let z = 0; z < this.cubeDepth; z++) {
			this.state[z] = []
			for (let y = 0; y < this.cubeHeight; y++) {
				this.state[z][y] = []
				for (let x = 0; x < this.cubeWidth; x++) {
					const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
					this.state[z][y][x] = this.createCell(randomColor, x, y, z);
				}
			}
		}
	}

	private createCell(
		colorObj: Cell,  // Pass the complete color object instead of just RGB
		x: number,
		y: number,
		z: number,
	): Cell3D {
		const radius = 1;
		const segments = 2;

		const geometry = new THREE.BoxGeometry(
			this.cellSize,
			this.cellSize,
			this.cellSize,
			segments,
			segments,
			segments,
			radius
		)

		const material = new THREE.MeshBasicMaterial({
			color: new THREE.Color(
				colorObj.colorRgb[0] / 255,
				colorObj.colorRgb[1] / 255,
				colorObj.colorRgb[2] / 255
			),
			transparent: true,
			opacity: 0.2,
			depthWrite: false
		})

		const mesh = new THREE.Mesh(geometry, material)

		const posX = (x - this.cubeWidth / 2) * this.cellSize
		const posY = (y - this.cubeHeight / 2) * this.cellSize
		const posZ = (z - this.cubeDepth / 2) * this.cellSize

		mesh.position.set(posX, posY, posZ)
		this.scene.add(mesh)

		// Simply return the combined object
		return {
			...colorObj,
			mesh
		};
	}

	private update = (): void => {
		// Initialize the new state array
		const newState: Cell3D[][][] = Array(this.cubeDepth)
			.fill(null)
			.map(() =>
				Array(this.cubeHeight)
					.fill(null)
					.map(() => Array(this.cubeWidth).fill(null))
			);

		// Single loop to calculate new state and update changed cells immediately
		for (let z = 0; z < this.cubeDepth; z++) {
			for (let y = 0; y < this.cubeHeight; y++) {
				for (let x = 0; x < this.cubeWidth; x++) {
					const currentCell = this.state[z][y][x];
					const neighbours = this.getNeighbours(x, y, z);
					const nextColorId = nextCellColorId(currentCell, this.colors);

					// Count neighbors with the next color ID
					const successorNeighboursCount = neighbours.filter(
						(neighbour) => neighbour.id === nextColorId,
					).length;

					// Update state based on threshold
					newState[z][y][x] = {
						...(successorNeighboursCount >= this.threshold
							? this.colors.find(color => color.id === nextColorId) ?? currentCell
							: currentCell),
						mesh: currentCell.mesh // Preserve the mesh reference
					};

					// Only update visual if state changed
					if (newState[z][y][x].id !== currentCell.id) {
						if (currentCell.mesh) {
							// Update existing mesh color
							if (currentCell.mesh.material instanceof THREE.Material) {
								currentCell.mesh.material.color.setRGB(
									newState[z][y][x].colorRgb[0] / 255,
									newState[z][y][x].colorRgb[1] / 255,
									newState[z][y][x].colorRgb[2] / 255
								);
							}
						} else {
							// Create new mesh if it doesn't exist
							newState[z][y][x].mesh = this.createCell(newState[z][y][x].colorRgb, x, y, z);
						}
					}
				}
			}
		}

		this.state = newState;
	}

	private getNeighbours(x: number, y: number, z: number):  Cell[] {
		const neighbours:  Cell[] = []
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

	private getCellColor(x: number, y: number, z: number):  Cell {
		const modifiedX = (x + this.cubeWidth) % this.cubeWidth
		const modifiedY = (y + this.cubeHeight) % this.cubeHeight
		const modifiedZ = (z + this.cubeDepth) % this.cubeDepth
		return this.state[modifiedZ][modifiedY][modifiedX]
	}

}
