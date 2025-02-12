import * as THREE from "three"

export interface Cell {
	id: number
	colorRgb: [number, number, number] // RGB tuple type
}
export interface Cell3D extends Cell {
	mesh?: THREE.Mesh
}
