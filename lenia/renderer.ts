import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer'

export class LeniaRenderer {
    private renderer: THREE.WebGLRenderer
    private camera: THREE.OrthographicCamera
    private scene: THREE.Scene
    private gpuCompute: GPUComputationRenderer
    private displayMesh: THREE.Mesh
    private stateVariable: any

    constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ canvas })
        this.renderer.setSize(width, height)

        // Orthographic camera for 2D view
        const aspect = width / height
        this.camera = new THREE.OrthographicCamera(
            -aspect, aspect,
            1, -1,
            0, 1
        )
        this.camera.position.z = 1

        // Scene setup
        this.scene = new THREE.Scene()
        
        // GPU computation setup
        this.gpuCompute = new GPUComputationRenderer(width, height, this.renderer)
        
        // Create computation textures
        const stateTexture = this.gpuCompute.createTexture()
        this.initializeTexture(stateTexture)
        
        // Add variable to GPUComputer
        this.stateVariable = this.gpuCompute.addVariable(
            'textureState',
            leniaComputeShader,
            stateTexture
        )

        // Set variable dependencies
        this.gpuCompute.setVariableDependencies(this.stateVariable, [this.stateVariable])

        // Initialize
        const error = this.gpuCompute.init()
        if (error !== null) {
            console.error(error)
        }

        // Display mesh (a simple plane)
        const geometry = new THREE.PlaneGeometry(2 * aspect, 2)
        const material = new THREE.MeshBasicMaterial({ 
            map: this.gpuCompute.getCurrentRenderTarget(this.stateVariable).texture 
        })
        this.displayMesh = new THREE.Mesh(geometry, material)
        this.scene.add(this.displayMesh)

        // After creating stateVariable
        this.stateVariable.material.uniforms.dt = { value: 0.1 }
        this.stateVariable.material.uniforms.mu = { value: 0.15 }
        this.stateVariable.material.uniforms.sigma = { value: 0.015 }
    }

    private initializeTexture(texture: THREE.DataTexture) {
        // Initialize with a small pattern in the center
        const data = texture.image.data
        const width = texture.image.width
        const height = texture.image.height
        const centerX = Math.floor(width / 2)
        const centerY = Math.floor(height / 2)
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4
                // Create a small circle in the center
                const dx = x - centerX
                const dy = y - centerY
                const d = Math.sqrt(dx * dx + dy * dy)
                if (d < 10) {  // 10 pixel radius
                    data[i] = 1     // R channel = state
                    data[i + 3] = 1 // A channel = 1
                }
            }
        }
    }

    public render() {
        this.gpuCompute.compute()
        this.renderer.render(this.scene, this.camera)
    }

    public clear() {
        const texture = this.gpuCompute.createTexture()
        this.initializeTexture(texture)
        this.gpuCompute.renderTexture(texture, this.stateVariable.renderTargets[0])
        this.gpuCompute.renderTexture(texture, this.stateVariable.renderTargets[1])
    }
}

const leniaComputeShader = `
    uniform float dt;
    uniform float mu;
    uniform float sigma;
    
    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 state = texture2D(textureState, uv);
        
        // Simple diffusion for now
        // TODO: Implement actual Lenia rules
        float sum = 0.0;
        for(float i = -1.0; i <= 1.0; i += 1.0) {
            for(float j = -1.0; j <= 1.0; j += 1.0) {
                vec2 offset = vec2(i, j) / resolution.xy;
                sum += texture2D(textureState, uv + offset).r;
            }
        }
        float average = sum / 9.0;
        
        gl_FragColor = vec4(average, 0.0, 0.0, 1.0);
    }
` 