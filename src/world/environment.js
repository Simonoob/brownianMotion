import Experience from '../experience'
import * as THREE from 'three'

export default class Environment {
	constructor() {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources
		this.debug = this.experience.debug

		this.debugFolder = this.debug.ui.addFolder({
			title: 'Environment',
			expanded: false,
		})

		this.setSunLight()
		this.setEnvironmentMap()
	}

	setSunLight() {
		this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
		this.sunLight.castShadow = true
		this.sunLight.shadow.camera.far = 15
		this.sunLight.shadow.mapSize.set(1024, 1024)
		this.sunLight.shadow.normalBias = 0.05
		this.sunLight.position.set(3, 1.25, -2.25)

		this.scene.add(this.sunLight)

		//debug
		const sunLightFolder = this.debugFolder.addFolder({
			title: 'Sun light',
		})

		sunLightFolder.addInput(this.sunLight, 'intensity', {
			min: -10,
			max: 10,
			step: 0.01,
		})

		sunLightFolder.addInput(this.sunLight.position, 'x', {
			min: -10,
			max: 10,
			step: 0.01,
		})

		sunLightFolder.addInput(this.sunLight.position, 'y', {
			min: 0,
			max: 10,
			step: 0.01,
		})

		sunLightFolder.addInput(this.sunLight.position, 'z', {
			min: -10,
			max: 10,
			step: 0.01,
		})
	}

	setEnvironmentMap() {
		this.environmentMap = {}
		this.environmentMap.intensity = 0.4
		this.environmentMap.texture = this.resources.items.environmentMapTexture
		this.environmentMap.texture.encoding = THREE.sRGBEncoding

		this.scene.environment = this.environmentMap.texture

		this.setEnvironmentMap.updateMaterial = () => {
			this.scene.traverse(child => {
				if (
					child instanceof THREE.Mesh &&
					child.material instanceof THREE.MeshStandardMaterial
				) {
					child.material.envMap = this.environmentMap.texture
					child.material.envMapIntensity =
						this.environmentMap.intensity
					child.material.needsUpdate = true
				}
			})
		}

		this.setEnvironmentMap.updateMaterial()

		this.debugFolder
			.addInput(this.environmentMap, 'intensity', {
				label: 'Env. map intensity',
				min: 0,
				max: 5,
				step: 0.01,
			})
			.on('change', () => this.setEnvironmentMap.updateMaterial())
	}
}
