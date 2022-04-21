import * as THREE from 'three'
import Sizes from './utils/sizes'
import Time from './utils/time'
import Camera from './camera'
import Renderer from './utils/renderer'
import World from './world/world'
import Resources from './utils/resources'
import sources from './sources'
import Debug from './world/debug'

let instance = null

export default class Experience {
	constructor(canvas) {
		if (instance) return instance
		instance = this

		window.experience = this
		this.canvas = canvas

		//setup
		this.sizes = new Sizes()
		this.time = new Time()
		this.resources = new Resources(sources)
		this.resources.on('resources_ready', () => {
			this.debug = new Debug()
			this.scene = new THREE.Scene()
			this.camera = new Camera()
			this.renderer = new Renderer()
			this.world = new World()
		})

		//event listeners
		this.sizes.on('resize', () => this.resize())
		this.time.on('tick', () => this.update())
	}

	resize() {
		this.camera.resize()
		this.renderer.resize()
	}
	update() {
		this.camera && this.camera.update()
		this.world && this.world.update()
		this.renderer && this.renderer.update()
	}
}
