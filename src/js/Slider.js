import render from './utils';

export default class Slider {
	constructor({
		sliderElemSelector,
		slidesContainerSelector,
		nextBtnsSelector,
		prevBtnsSelector,
		startSlideIndex = 0,
		vertical = false,
		duration = 600,
		animated = true,
		timingFunction = 'linear',
		activeClass,
	}) {
		this.sliderElemSelector = sliderElemSelector;
		this.slidesContainerSelector = slidesContainerSelector;
		this.nextBtnsSelector = nextBtnsSelector;
		this.prevBtnsSelector = prevBtnsSelector;

		this.sliderElem = document.querySelector(sliderElemSelector);
		this.slidesContainer = document.querySelector(slidesContainerSelector);
		this.nextBtns = document.querySelectorAll(nextBtnsSelector);
		this.prevBtns = document.querySelectorAll(prevBtnsSelector);

		this.orientation = vertical ? 'Y' : 'X';
		this.duration = duration;
		this.animated = animated;
		this.timingFunction = timingFunction;
		this.activeClass = activeClass;

		this.init(startSlideIndex);
	}

	get currentSlide() {
		return this.slides[0];
	}

	get currentSlideIndex() {
		return this.getSlideIndex(this.currentSlide);
	}

	get slides() {
		return Array.from(this.slidesContainer.children);
	}

	getSlide(index) {
		return this.slidesContainer.querySelector(
			`${this.slidesContainerSelector} > [data-slide-index="${index}"]`,
		);
	}

	getSlideIndex(slide) {
		return +slide.dataset.slideIndex;
	}

	getValidSlideIndex(index) {
		let validIndex;

		if (index > this.slides.length - 1) {
			validIndex = 0;
		} else if (index < 0) {
			validIndex = this.slides.length - 1;
		} else {
			validIndex = index;
		}

		return validIndex;
	}

	init(startSlideIndex) {
		this.initSlides();
		this.initSliderElem();
		this.initSlidesContainer();
		this.slideTo(startSlideIndex, false);

		if (this.nextBtns.length) {
			this.nextBtns.forEach(btn =>
				btn.addEventListener('click', event => {
					event.preventDefault();
					this.nextSlide();
				}),
			);
		}

		if (this.prevBtns.length) {
			this.prevBtns.forEach(btn =>
				btn.addEventListener('click', event => {
					event.preventDefault();
					this.prevSlide();
				}),
			);
		}
	}

	initSlides() {
		this.slides.forEach((slide, index) => {
			slide.dataset.slideIndex = index;
			slide.style.overflow = 'hidden';
			this.removeActiveClass(slide);
		});
	}

	initSlidesContainer() {
		this.slidesContainer.style.display = 'flex';
		this.slidesContainer.style.width = 'fit-content';
		this.slidesContainer.style.height = 'fit-content';

		if (this.orientation === 'X') {
			this.slidesContainer.style.flexDirection = 'row';
			this.slidesContainer.style.alignItems = 'center';
		} else {
			this.slidesContainer.style.flexDirection = 'column';
			this.slidesContainer.style.justifyContent = 'center';
		}
	}

	initSliderElem() {
		this.sliderElem.style.overflow = 'hidden';
	}

	async nextSlide() {
		await this.slideTo(this.currentSlideIndex + 1);
	}

	async prevSlide() {
		await this.slideTo(this.currentSlideIndex - 1);
	}

	async slideTo(slideIndex, animated = this.animated) {
		const newSlideIndex = this.getValidSlideIndex(slideIndex);

		if (this.isChangingSlides) return;
		if (this.currentSlideIndex === newSlideIndex) {
			this.addActiveClass(this.currentSlide);
			return;
		}

		this.isChangingSlides = true;

		const prevSlide = this.currentSlide;
		const prevSlideIndex = this.getSlideIndex(prevSlide);

		let isForwardDirection = prevSlideIndex < newSlideIndex;
		// if sliding from last slide to first slide or from first to last
		isForwardDirection =
			Math.abs(prevSlideIndex - newSlideIndex) === this.slides.length - 1
				? !isForwardDirection
				: isForwardDirection;

		let slidesDiff = Math.abs(prevSlideIndex - newSlideIndex);
		// if sliding from last slide to first slide or from first to last
		// it slides in one step, not through all slides
		slidesDiff = slidesDiff === this.slides.length - 1 ? 1 : slidesDiff;

		const slidePosition = this.slides.indexOf(this.getSlide(newSlideIndex));

		if (isForwardDirection) {
			if (animated) await runSlideChangeAnimation.call(this);
			updateSlidesSequence.call(this);
			await render();
		} else {
			updateSlidesSequence.call(this);
			await render();
			if (animated) await runSlideChangeAnimation.call(this);
		}

		this.removeActiveClass(prevSlide);
		this.addActiveClass(this.currentSlide);
		this.isChangingSlides = false;
		this.dispatchSlideChangedEvent();

		async function runSlideChangeAnimation() {
			const perSlidePerсent = +(100 / this.slides.length).toFixed(4);
			const slidePercent = perSlidePerсent * slidesDiff;

			const keyFrames = [
				{ transform: `translate${this.orientation}(0)`, position: 'absolute' },
				{ transform: `translate${this.orientation}(-${slidePercent}%)`, position: 'absolute' },
			];

			return this.slidesContainer.animate(isForwardDirection ? keyFrames : keyFrames.reverse(), {
				duration: this.duration,
				easing: this.timingFunction,
			}).finished;
		}

		function updateSlidesSequence() {
			if (isForwardDirection) {
				this.slides.forEach((slide, i) => {
					if (i < slidePosition) this.slidesContainer.append(slide);
				});
			} else {
				this.slides
					.slice()
					.reverse()
					.forEach(slide => {
						const i = this.getSlideIndex(slide);

						if (prevSlideIndex !== 0) {
							if (i < prevSlideIndex && i >= newSlideIndex) {
								this.slidesContainer.prepend(slide);
							}
						} else if (i === this.slides.length - 1) {
							// if sliding from first slide to last
							this.slidesContainer.prepend(slide);
						}
					});
			}
		}
	}

	dispatchSlideChangedEvent() {
		this.sliderElem.dispatchEvent(
			new CustomEvent('slideChanged', {
				bubbles: true,
				detail: {
					slide: this.currentSlide,
					slideIndex: this.currentSlideIndex,
				},
			}),
		);
	}

	addActiveClass(slide) {
		if (this.activeClass) {
			slide.classList.add(this.activeClass);
		}
	}

	removeActiveClass(slide) {
		if (this.activeClass) {
			slide.classList.remove(this.activeClass);
		}
	}
}
