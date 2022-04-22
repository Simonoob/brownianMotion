import Experience from '../experience'
import fragmentShader from '../shaders/fragment.glsl'
import vertexShader from '../shaders/vertex.glsl'
import * as THREE from 'three'

export default class ShaderPlane {
	constructor() {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources
		this.debug = this.experience.debug

		this.params = {
			texture: 0,
		}

		this.geometry = new THREE.PlaneGeometry(1, 1)
		this.material = new THREE.ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			side: THREE.DoubleSide,
			uniforms: {
				uTime: { value: this.experience.time.elapsed },
				uSurfaceResolution: {
					value: {
						x: this.geometry.parameters.width,
						y: this.geometry.parameters.height,
					},
				},
				uSeed: { value: Math.random() * (0.5 - 0.4) + 0.4 },
				uCursor: { value: new THREE.Vector2(0) },
				uCursorHover: { value: false },
				uCursorEnter: { value: false },
				uCursorLeave: { value: false },
				uSpeed: { value: 1 },
			},
		})

		this.shaderMesh = new THREE.Mesh(this.geometry, this.material)
		this.shaderMesh.position.y = 1
		this.scene.add(this.shaderMesh)

		//debug
		this.debugFolder = this.debug.ui.addFolder({
			title: 'Shader',
			index: 0,
		})

		this.debugFolder.addInput(this.material.uniforms.uSpeed, 'value', {
			step: 0.1,
			min: 0,
			max: 10,
			label: 'Speed',
		})

	}

	update = () => {
		const uniforms = this.shaderMesh.material.uniforms
		uniforms.uTime.value = this.experience.time.elapsed
	}
}
