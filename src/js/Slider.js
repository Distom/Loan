export default class Slider {
	constructor({
		containerSelector,
		nextBtnsSelector,
		prevBtnsSelector,
		startSlideIndex = 0,
		vertical = false,
		duration = 600,
		timingFunction = 'linear',
		activeClass = '',
	}) {
		this.container = document.querySelector(containerSelector);
		this.slides = Array.from(this.container.children);
		this.nextBtns = document.querySelectorAll(nextBtnsSelector);
		this.prevBtns = document.querySelectorAll(prevBtnsSelector);
		this.orientation = vertical ? 'Y' : 'X';
		this.duration = duration;
		this.timingFunction = timingFunction;
		this.activeClass = activeClass;
		this.setCurrentSlideIndex(startSlideIndex);

		this.init();
	}

	get currentSlide() {
		return this.slides[this.currentSlideIndex];
	}

	setCurrentSlideIndex(index) {
		if (index > this.slides.length - 1) {
			this.currentSlideIndex = 0;
		} else if (index < 0) {
			this.currentSlideIndex = this.slides.length - 1;
		} else {
			this.currentSlideIndex = index;
		}
	}

	init() {
		this.initSlides();
		this.container.overflow = 'hidden';
		this.currentSlide.style.display = '';
		this.addActiveClass(this.currentSlide);

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
		this.slides.forEach(slide => {
			slide.style.display = 'none';
			slide.style.overflow = 'hidden';
			this.removeActiveClass(slide);
		});
	}

	async nextSlide() {
		await this.slideTo(this.currentSlideIndex + 1);
	}

	async prevSlide() {
		await this.slideTo(this.currentSlideIndex - 1);
	}

	async slideTo(slideIndex) {
		if (this.isChangingSlides || this.currentSlide === this.slides[slideIndex]) return;
		this.isChangingSlides = true;

		const fromActiveToTopSlideKeyFrames = [
			{ transform: `translate${this.orientation}(0)`, position: 'absolute' },
			{ transform: `translate${this.orientation}(-100%)`, position: 'absolute' },
		];

		const fromBottomToActiveSlideKeyFrames = [
			{ transform: `translate${this.orientation}(100%)`, position: 'absolute' },
			{ transform: `translate${this.orientation}(0)`, position: 'absolute' },
		];

		const animationOptions = {
			duration: this.duration,
			easing: this.timingFunction,
		};

		const isForwardDirection = slideIndex > this.currentSlideIndex;

		const prevSlideKeyFrames = isForwardDirection
			? fromActiveToTopSlideKeyFrames
			: fromBottomToActiveSlideKeyFrames.reverse();
		const currentSlideKeyFrames = isForwardDirection
			? fromBottomToActiveSlideKeyFrames
			: fromActiveToTopSlideKeyFrames.reverse();

		const prevSlide = this.currentSlide;
		this.removeActiveClass(prevSlide);
		this.setCurrentSlideIndex(slideIndex);
		this.currentSlide.style.display = '';
		this.addActiveClass(this.currentSlide);

		await Promise.all([
			prevSlide.animate(prevSlideKeyFrames, animationOptions).finished,
			this.currentSlide.animate(currentSlideKeyFrames, animationOptions).finished,
		]);

		prevSlide.style.display = 'none';
		this.isChangingSlides = false;
		this.dispatchSlideChangedEvent();
	}

	dispatchSlideChangedEvent() {
		this.container.dispatchEvent(
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
