import * as THREE from 'three'
import Experience from '../experience'

export default class Cursor {
	constructor() {
		this.experience = new Experience()
		this.shaderPlane = this.experience.world.ShaderPlane
		this.sizes = this.experience.sizes
		this.camera = this.experience.camera.instance

		this.raycaster = new THREE.Raycaster()
		this.cursorPointer = new THREE.Vector2()

		this.intersects = false
		this.intersectsPrev = false

		window.addEventListener('mousemove', event => {
			this.cursorPointer.x = (event.clientX / this.sizes.width) * 2 - 1
			this.cursorPointer.y = -(
				(event.clientY / this.sizes.height) * 2 -
				1
			)
		})
	}

	update() {
		//check intersection with shader plane
		this.raycaster.setFromCamera(this.cursorPointer, this.camera)
		this.intersects = this.raycaster.intersectObject(
			this.shaderPlane.shaderMesh,
		)[0]

		//update cursor enter and leave values
		switch (true) {
			case this.intersectsPrev && this.intersects:
				this.cursorEnter = false
				this.cursorLeave = false
				this.cursorHover = true
				break

			case !this.intersectsPrev && this.intersects:
				this.cursorEnter = true
				this.cursorLeave = false
				this.cursorHover = false

				this.intersectsPrev = true
				break

			case this.intersectsPrev && !this.intersects:
				this.cursorEnter = false
				this.cursorLeave = true
				this.cursorHover = false

				this.intersectsPrev = false
				break

			default:
				this.cursorEnter = false
				this.cursorLeave = false
				this.cursorHover = false
				break
		}

		//update cursor position
		if (this.intersects)
			this.shaderPlane.shaderMesh.material.uniforms.uCursor.value =
				this.intersects.uv

		//update cursor states
		this.shaderPlane.shaderMesh.material.uniforms.uCursorEnter.value =
			this.cursorEnter
		this.shaderPlane.shaderMesh.material.uniforms.uCursorLeave.value =
			this.cursorLeave
		this.shaderPlane.shaderMesh.material.uniforms.uCursorHover.value =
			this.cursorHover
	}
}
