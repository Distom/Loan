export default class Toggle {
	constructor({ button, contentElem, activeClass }) {
		this.button = button;
		this.contentElem = contentElem;
		this.activeClass = activeClass;

		this.init();
	}

	init() {
		this.button.addEventListener('click', () =>
			this.contentElem.classList.toggle(this.activeClass),
		);
	}
}
