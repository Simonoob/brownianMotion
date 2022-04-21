import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Experience from './experience'

export default class Camera {
	constructor() {
		//setup
		this.experience = new Experience()
		this.sizes = this.experience.sizes
		this.scene = this.experience.scene
		this.canvas = this.experience.canvas
		this.debug = this.experience.debug
		this.setInstance()
		this.setOrbitControls()

		//debug
		const cameraFolder = this.debug.ui.addFolder({ title: 'Camera' })
		const autoRotationButton = cameraFolder.addButton({
			title: `Auto Rotation ${this.controls.autoRotate ? 'on' : 'off'}`,
		})
		autoRotationButton.on('click', () => {
			this.controls.autoRotate = !this.controls.autoRotate
			autoRotationButton.title = `Auto Rotation ${
				this.controls.autoRotate ? 'on' : 'off'
			}`
		})

		cameraFolder
			.addButton({
				title: `Reset Camera`,
			})
			.on('click', () => {
				this.controls.reset()
				this.controls.target = new THREE.Vector3(0, 1, 0)
			})
	}

	setInstance() {
		this.instance = new THREE.PerspectiveCamera(
			35,
			this.sizes.width / this.sizes.height,
			0.1,
			100,
		)
		this.instance.position.set(0, 1, 4)
		this.instance.aspect = this.sizes.width / this.sizes.height
		this.instance.updateProjectionMatrix()
		this.scene.add(this.instance)
	}

	setOrbitControls() {
		this.controls = new OrbitControls(this.instance, this.canvas)
		this.controls.target = new THREE.Vector3(0, 1, 0)
		this.controls.enableDamping = true
		this.controls.autoRotate = true
        this.controls.enablePan = false
		this.controls.autoRotateSpeed = 0.2
		this.controls.minDistance = 2.5
		this.controls.maxDistance = 10
	}

	resize() {
		this.instance.aspect = this.sizes.width / this.sizes.height
		this.instance.updateProjectionMatrix()
	}

	update() {
		this.controls.update()
	}
}
