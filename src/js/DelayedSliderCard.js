export default class DelayedSliderCard {
	constructor({ sliderElemSelector, cardSelector, slideIndex, delay, activeClass }) {
		this.sliderElemSelector = sliderElemSelector;
		this.card = document.querySelector(cardSelector);
		this.slideIndex = slideIndex;
		this.delay = delay;
		this.activeClass = activeClass;

		this.init();
	}

	init() {
		this.onSlideChange = this.onSlideChange.bind(this);
		document.addEventListener('slideChanged', this.onSlideChange);
	}

	onSlideChange(event) {
		if (event.detail.sliderElemSelector !== this.sliderElemSelector) return;
		if (event.detail.slideIndex !== this.slideIndex) return;

		setTimeout(this.show.bind(this), this.delay);
		document.removeEventListener('slideChanged', this.onSlideChange);
	}

	show() {
		this.card.classList.add(this.activeClass);
	}
}
