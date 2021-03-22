import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { nextCellColorId, pickColors } from "../common.js"

export var CCA3DframeId

export class CCA3D {

	constructor(threshold, canvasEl, width, height, resolution, colorsCount) {
		this.colors = pickColors(colorsCount)
		this.state = []

		// Create scene and camera
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000,
		)
		this.renderer = new THREE.WebGLRenderer()
		renderer.setSize(window.innerWidth, window.innerHeight)
		document.body.appendChild(renderer.domElement)

		// DEBUG: add axes
		const axesHelper = new THREE.AxesHelper(5)
		scene.add(axesHelper)

		this.colors = colors
		this.threshold = threshold
		this.cubeGeometry = new THREE.BoxGeometry() // create a cube
		this.resolution = resolution
		this.spaceBetween = spaceBetween
		this.xCount = resolution
		this.yCount = resolution
		this.zCount= resolution

		// render the start frame
		CCA2DsetRandomState(context)
		CCA3Drender(context)

		// Turn around with the camera
		const controls = new OrbitControls(camera, renderer.domElement)
		//controls.update() must be called after any manual changes to the camera's transform
		camera.position.set(15, 15, 20)
		controls.update()
		function animate() {
			setTimeout(() => {
				CCA3DframeId = requestAnimationFrame(animate)
				console.log("New frame " + CCA3DframeId)

				// required if controls.enableDamping or controls.autoRotate are set to true
				controls.update()

				// // Update the state and re-render
				const newState = CCA3DsetNewState(context)
				context.state = newState
				CCA3Drender(context)

				renderer.render(scene, camera)
			}, 1000 / 8)
		}
		animate()
		// cancelAnimationFrame(CCA3DframeId);
	}

	CCA3Drender = (context) => {
		// remove previous scene objects
		while (context.scene.children.length > 0) {
			context.scene.remove(context.scene.children[0])
		}
		// let state = context.state;
		for (let z = 0; z < context.zCount; ++z) {
			for (let y = 0; y < context.yCount; ++y) {
				for (let x = 0; x < context.xCount; ++x) {
					const colorRgb = context.state[z][y][x]
					fillCube(context, colorRgb, x, y, z)
				}
			}
		}
	}

	CCA2DsetRandomState = (context) => {
		for (let z = 0; z < context.zCount; ++z) {
			for (let y = 0; y < context.yCount; ++y) {
				for (let x = 0; x < context.xCount; ++x) {
					if (!context.state[z]) context.state[z] = []
					if (!context.state[z][y]) context.state[z][y] = []
					const randomColor =
						context.colors[Math.floor(Math.random() * context.colors.length)]
					context.state[z][y][x] = randomColor
				}
			}
		}
	}

	CCA3DsetNewState = (context) => {
		const newState = []
		for (let z = 0; z < context.zCount; ++z) {
			if (!newState[z]) newState[z] = []
			for (let y = 0; y < context.yCount; ++y) {
				if (!newState[z][y]) newState[z][y] = []
				for (let x = 0; x < context.xCount; ++x) {
					const neighbours = [
						// z-1: 9 cells
						CCA3DgetCellColor(context, x - 1, y - 1, z - 1),
						CCA3DgetCellColor(context, x, y - 1, z - 1),
						CCA3DgetCellColor(context, x + 1, y - 1, z - 1),

						CCA3DgetCellColor(context, x - 1, y, z - 1),
						CCA3DgetCellColor(context, x, y, z - 1),
						CCA3DgetCellColor(context, x + 1, y, z - 1),

						CCA3DgetCellColor(context, x - 1, y + 1, z - 1),
						CCA3DgetCellColor(context, x, y + 1, z - 1),
						CCA3DgetCellColor(context, x + 1, y + 1, z - 1),

						// z: 8 cells
						CCA3DgetCellColor(context, x - 1, y - 1, z),
						CCA3DgetCellColor(context, x, y - 1, z),
						CCA3DgetCellColor(context, x + 1, y - 1, z),

						CCA3DgetCellColor(context, x - 1, y, z),
						CCA3DgetCellColor(context, x + 1, y, z),

						CCA3DgetCellColor(context, x - 1, y + 1, z),
						CCA3DgetCellColor(context, x, y + 1, z),
						CCA3DgetCellColor(context, x + 1, y + 1, z),

						// z+1: 9 cells
						CCA3DgetCellColor(context, x - 1, y - 1, z + 1),
						CCA3DgetCellColor(context, x, y - 1, z + 1),
						CCA3DgetCellColor(context, x + 1, y - 1, z + 1),

						CCA3DgetCellColor(context, x - 1, y, z + 1),
						CCA3DgetCellColor(context, x, y, z + 1),
						CCA3DgetCellColor(context, x + 1, y, z + 1),

						CCA3DgetCellColor(context, x - 1, y + 1, z + 1),
						CCA3DgetCellColor(context, x, y + 1, z + 1),
						CCA3DgetCellColor(context, x + 1, y + 1, z + 1),
					]

					const thisCell = context.state[z][y][x]
					const nextColorId = nextCellColorId(thisCell, context.colors)
					const successorNeighboursCount = neighbours.filter(
						(neighbour) => neighbour.id == nextColorId,
					)

					newState[z][y][x] =
						successorNeighboursCount.length >= context.threshold
							? successorNeighboursCount[0]
							: thisCell
				}
			}
		}
		return newState
	}

	CCA3DgetCellColor = (context, x, y, z) => {
		const xCount = context.xCount
		const yCount = context.yCount
		const zCount = context.zCount

		x = x === -1 ? xCount - 1 : x
		x = x === xCount ? 0 : x

		y = y === -1 ? yCount - 1 : y
		y = y === yCount ? 0 : y

		z = z === -1 ? zCount - 1 : z
		z = z === zCount ? 0 : z

		return context.state[z][y][x]
	}

	fillCube = (context, colorRgb, x, y, z) => {
		const threeColor = new THREE.Color(
			"rgb(" + colorRgb[0] + ", " + colorRgb[1] + ", " + colorRgb[2] + ")",
		)
		const material = new THREE.MeshBasicMaterial({
			color: threeColor,
			opacity: 0.5,
			transparent: true,
		})
		const cube = new THREE.Mesh(context.cubeGeometry, material)
		context.scene.add(cube)
		cube.position.set(
			x + context.spaceBetween * x,
			y + context.spaceBetween * y,
			z + context.spaceBetween * z,
		)
	}

}
