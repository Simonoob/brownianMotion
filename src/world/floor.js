import Experience from '../experience'
import * as THREE from 'three'

export default class Floor {
	constructor() {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources

		//setup
		this.setGeometry()
		this.setTextures()
		this.setMaterial()
		this.setMesh()
	}

	setGeometry() {
		this.geometry = new THREE.CircleGeometry(15, 64)
	}

	setTextures() {
		this.textures = {}

		this.textures.color = this.resources.items.dirtColorTexture
		this.textures.color.encoding = THREE.sRGBEncoding
		this.textures.color.repeat.set(10, 10)
		this.textures.color.wrapS = THREE.RepeatWrapping
		this.textures.color.wrapT = THREE.RepeatWrapping

		this.textures.normal = this.resources.items.dirtNormalTexture
		this.textures.normal.repeat.set(10, 10)
		this.textures.normal.wrapS = THREE.RepeatWrapping
		this.textures.normal.wrapT = THREE.RepeatWrapping
	}

	setMaterial() {
		this.material = new THREE.MeshStandardMaterial({
			map: this.textures.color,
			normalMap: this.textures.normal,
		})
	}

	setMesh() {
		this.mesh = new THREE.Mesh(this.geometry, this.material)
		this.mesh.rotation.x = -Math.PI * 0.5
		this.mesh.receiveShadow = true

		this.scene.add(this.mesh)
	}
}
