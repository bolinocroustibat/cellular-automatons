import type * as THREE from "three"
import type { RGB } from "./RGB"

export interface Cell {
	id: number
	colorRgb: RGB
}
export interface Cell3D extends Cell {
	mesh?: THREE.Mesh
}
