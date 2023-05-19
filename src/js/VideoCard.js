export default class VideoCard {
	constructor(cardElem, activeClass) {
		this.elem = cardElem;
		this.activeClass = activeClass;
		this.videoId = cardElem.querySelector('[data-video-id]').dataset.videoId;
	}

	get isActive() {
		return this.elem.classList.contains(this.activeClass);
	}

	activate() {
		if (!this.elem.classList.contains(this.activeClass)) {
			this.elem.classList.add(this.activeClass);
		}
	}

	disable() {
		this.elem.classList.remove(this.activeClass);
	}
}
