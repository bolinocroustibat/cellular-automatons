import * as THREE from 'three'
import type { ColorObject } from "../types/ColorObject"
import { nextCellColorId } from "../utils/nextCellColorId"
import { pickColors } from "../utils/pickColors"

export class CCA3D {
	private colorsCount: number
	private colors: ColorObject[]
	private state: ColorObject[][][]
	private cubeSize: number
	private width: number
	private height: number
	private depth: number
	private scene: THREE.Scene
	private renderInterval: NodeJS.Timer

	constructor(canvasEl: HTMLCanvasElement, width: number, height: number, depth: number, colorsCount: number, cubeSize: number) {
		this.width = width
		this.height = height
		this.depth = depth
		this.colorsCount = colorsCount
		this.colors = pickColors(colorsCount)
		this.state = this.initializeState(width, height, depth)
		this.cubeSize = cubeSize
		this.scene = new THREE.Scene()
		this.render(0)
	}

	private initializeState(width: number, height: number, depth: number): ColorObject[][][] {
		const state: ColorObject[][][] = []
		for (let z = 0; z < depth; z++) {
			state[z] = []
			for (let y = 0; y < height; y++) {
				state[z][y] = []
				for (let x = 0; x < width; x++) {
					const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)]
					state[z][y][x] = randomColor
				}
			}
		}
		return state
	}

	start = (intervalMs: number): void => {
		let line = 0
		this.renderInterval = setInterval(() => {
			if (++line === this.depth) clearInterval(this.renderInterval)
			this.changeState(line)
		}, intervalMs)
	}

	changeState = (line: number): void => {
		const newState: ColorObject[][][] = this.initializeState(this.width, this.height, this.depth)
		for (let z = 0; z < this.depth; z++) {
			for (let y = 0; y < this.height; y++) {
				for (let x = 0; x < this.width; x++) {
					const neighbours = this.getNeighbours(x, y, z)
					const nextColorId = nextCellColorId(this.state[z][y][x], this.colors)
					const successorNeighboursCount = neighbours.filter(neighbour => neighbour.id === nextColorId)
					newState[z][y][x] = successorNeighboursCount.length >= 1 ? successorNeighboursCount[0] : this.state[z][y][x]
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
		const modifiedX = (x + this.width) % this.width
		const modifiedY = (y + this.height) % this.height
		const modifiedZ = (z + this.depth) % this.depth
		return this.state[modifiedZ][modifiedY][modifiedX]
	}

	private fillCube(colorRgb: [number, number, number], x: number, y: number, z: number): void {
		const geometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize)
		const material = new THREE.MeshBasicMaterial({ color: `rgb(${colorRgb[0]},${colorRgb[1]},${colorRgb[2]})` })
		const cube = new THREE.Mesh(geometry, material)
		cube.position.set(x * this.cubeSize, y * this.cubeSize, z * this.cubeSize)
		this.scene.add(cube)
	}

	render = (line: number): void => {
		for (let z = 0; z < this.depth; z++) {
			for (let y = 0; y < this.height; y++) {
				for (let x = 0; x < this.width; x++) {
					this.fillCube(this.state[z][y][x].colorRgb, x, y, z)
				}
			}
		}
	}
}

