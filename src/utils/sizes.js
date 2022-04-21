import EventEmitter from './eventEmitter'
import Experience from '../experience'

export default class Sizes extends EventEmitter {
	constructor() {
		//setup
		super()
		this.width = window.innerWidth
		this.height = window.innerHeight
		this.pixelRatio = Math.min(window.devicePixelRatio, 2)
		this.experience = new Experience()

		//resize events
		window.addEventListener('resize', () => {
			this.width = window.innerWidth
			this.height = window.innerHeight
			this.pixelRatio = Math.min(window.devicePixelRatio, 2)
			//alert a resize occurred
			this.trigger('resize')
		})
	}
}
