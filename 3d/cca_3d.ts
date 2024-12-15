import * as THREE from "three"
import type { Cell } from "../types/ Cell"
import { nextCellColorId } from "../utils/nextCellColorId"
import { pickColors } from "../utils/pickColors"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

interface Cell3D extends Cell {
	mesh?: THREE.Mesh
}

export class CCA3D {
	private canvasEl: HTMLCanvasElement
	private width: number
	private height: number
	private cubeDimension: number
	private cellSize: number
	private cellFilling: number
	private threshold: number
	private colors: Cell[]
	private state: Cell3D[][][]
	private rotationSpeed: number
	private scene: THREE.Scene
	private cellGroup: THREE.Group;
	private camera: THREE.PerspectiveCamera
	private controls: OrbitControls;
	private isUserInteracting: boolean = false;
	private renderer: THREE.WebGLRenderer
	private animationFrameCount: number = 0
	renderInterval?: NodeJS.Timer  // Store interval reference
	private lastFrameTime: number = performance.now() 	// Timer

	constructor(
		canvasEl: HTMLCanvasElement,
		width: number,
		height: number,
		resolution: number,
		threshold: number,
		colorsCount: number,
	) {
		this.canvasEl = canvasEl
		this.width = width
		this.height = height
		this.cubeDimension = 20
		this.cellSize = 10
		this.cellFilling = 0.8
		this.threshold = threshold // 4 is good
		this.colors = pickColors(colorsCount) // 10 is good
		this.state = []
		this.rotationSpeed = 0.004

		// Initialize scene first
		this.scene = new THREE.Scene()

		// Create a group to hold all cubes and center it
		this.cellGroup = new THREE.Group()
		this.scene.add(this.cellGroup)

		// Set up camera
		this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
		this.camera.position.set(200, 200, 300)
		this.camera.lookAt(0, 0, 0) // Look at center

		// Initialize renderer
		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setSize(this.width, this.height)
		this.canvasEl.replaceWith(this.renderer.domElement)

		// Add OrbitControls
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true; // Add smooth damping
		this.controls.dampingFactor = 0.05;
		this.controls.rotateSpeed = 0.5;

		// Add event listeners for user interaction
		this.controls.addEventListener('start', () => {
			this.isUserInteracting = true;
		});

		// Initial random populating
		this.setInitialState()

		// Initial render
		this.renderer.render(this.scene, this.camera)

		// Animate with rotation
		this.animate()

	}

	public animate = (): void => {
		const currentTime = performance.now();
		const frameTime = currentTime - this.lastFrameTime;
		this.lastFrameTime = currentTime

		requestAnimationFrame(this.animate)

		// Update controls
		this.controls.update();

		// Increment frame counter
		this.animationFrameCount++

		// Only apply automatic rotation if user is not interacting
		if (!this.isUserInteracting) {
			this.cellGroup.rotation.x += this.rotationSpeed;
			this.cellGroup.rotation.y += this.rotationSpeed;
			this.cellGroup.rotation.z += this.rotationSpeed;
		}

		// Render every frame
		this.renderer.render(this.scene, this.camera)

		// Log performance every 60 frames
		if (this.animationFrameCount % 60 === 0) {
			console.clear();
			console.log(`Frame time: ${frameTime.toFixed(2)}ms`)
		}
	}

	public start = (stateUpdatesPerSecond: number): void => {
		// Clear any existing interval
		if (this.renderInterval) {
			clearInterval(this.renderInterval)
		}

		const intervalMs = 1000 / stateUpdatesPerSecond
		this.renderInterval = setInterval(() => {
			this.update()
		}, intervalMs)
	}

	public reset = (): void => {
		clearInterval(this.renderInterval)
		this.cellGroup.clear()
		this.setInitialState()
		this.renderer.render(this.scene, this.camera)
	}

	private setInitialState = (): void => {
		for (let z = 0; z < this.cubeDimension; z++) {
			this.state[z] = []
			for (let y = 0; y < this.cubeDimension; y++) {
				this.state[z][y] = []
				for (let x = 0; x < this.cubeDimension; x++) {
					const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)]
					this.state[z][y][x] = this.createCell(randomColor, x, y, z)
				}
			}
		}
	}

	private createCell(
		colorObj: Cell,
		x: number,
		y: number,
		z: number,
	): Cell3D {
		const geometry = new THREE.BoxGeometry(
			this.cellSize * this.cellFilling,
			this.cellSize * this.cellFilling,
			this.cellSize * this.cellFilling
		)

		const material = new THREE.MeshBasicMaterial({
			color: new THREE.Color(
				colorObj.colorRgb[0] / 255,
				colorObj.colorRgb[1] / 255,
				colorObj.colorRgb[2] / 255
			),
			transparent: true,
			opacity: 0.4,
			depthWrite: false
		})

		const mesh = new THREE.Mesh(geometry, material)

		const posX = (x - this.cubeDimension / 2) * this.cellSize
		const posY = (y - this.cubeDimension / 2) * this.cellSize
		const posZ = (z - this.cubeDimension / 2) * this.cellSize

		mesh.position.set(posX, posY, posZ)
		this.cellGroup.add(mesh)

		// Simply return the combined object
		return {
			...colorObj,
			mesh
		}
	}

	private update = (): void => {
		// Initialize the new state array
		const newState: Cell3D[][][] = Array(this.cubeDimension)
			.fill(null)
			.map(() =>
				Array(this.cubeDimension)
					.fill(null)
					.map(() => Array(this.cubeDimension).fill(null))
			)

		// Single loop to calculate new state and update changed cells immediately
		for (let z = 0; z < this.cubeDimension; z++) {
			for (let y = 0; y < this.cubeDimension; y++) {
				for (let x = 0; x < this.cubeDimension; x++) {
					const currentCell = this.state[z][y][x]
					const neighbours = this.getNeighbours(x, y, z)
					const nextColorId = nextCellColorId(currentCell, this.colors)

					// Count neighbors with the next color ID
					const successorNeighboursCount = neighbours.filter(
						(neighbour) => neighbour.id === nextColorId,
					).length

					// Update state based on threshold
					newState[z][y][x] = {
						...(successorNeighboursCount >= this.threshold
							? this.colors.find(color => color.id === nextColorId) ?? currentCell
							: currentCell),
						mesh: currentCell.mesh // Preserve the mesh reference
					}

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
							newState[z][y][x].mesh = this.createCell(newState[z][y][x].colorRgb, x, y, z)
						}
					}
				}
			}
		}

		this.state = newState
	}

	private getNeighbours(x: number, y: number, z: number): Cell[] {
		const neighbours: Cell[] = []
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

	private getCellColor(x: number, y: number, z: number): Cell {
		const modifiedX = (x + this.cubeDimension) % this.cubeDimension
		const modifiedY = (y + this.cubeDimension) % this.cubeDimension
		const modifiedZ = (z + this.cubeDimension) % this.cubeDimension
		return this.state[modifiedZ][modifiedY][modifiedX]
	}

}
