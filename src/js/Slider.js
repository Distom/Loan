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
		animationType = 'none',
		timingFunction = 'linear',
		activeClass,
		spaceBetween = 0,
		autoSliding = false,
		autoSlidingInterval = 3000,
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
		this.animationType = animationType;
		this.timingFunction = timingFunction;
		this.activeClass = activeClass;
		this.spaceBetween = spaceBetween;
		this.autoSliding = autoSliding;
		this.autoSlidingInterval = autoSlidingInterval;

		// to animate slides with different active and regular width
		// wait until active slide's transition rendered to get correct values
		render().then(() => {
			this.slidesContainerWidth = this.slidesContainer.scrollWidth;
			this.slidesContainerHeight = this.slidesContainer.scrollHeight;
			this.activeSlideWidth = this.currentSlide.offsetWidth;
			this.activeSlideHeight = this.currentSlide.offsetHeight;
			this.slideWidth = this.slides[1].offsetWidth;
			this.slideHeight = this.slides[1].offsetHeight;
		});

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
		this.bindMethods();

		this.initSlides();
		this.initSliderElem();
		this.initSlidesContainer();
		this.bindSliderButtons();

		this.slideTo(startSlideIndex, false);

		if (this.autoSliding) {
			this.initAutoSliding();
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
		this.slidesContainer.style.gap = `${this.spaceBetween}px`;
		this.slidesContainer.style.flexDirection = this.orientation === 'X' ? 'row' : 'column';
	}

	initSliderElem() {
		this.sliderElem.style.overflow = 'hidden';
	}

	bindSliderButtons() {
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

	bindMethods() {
		this.startAutoSliding = this.startAutoSliding.bind(this);
		this.stopAutoSliding = this.stopAutoSliding.bind(this);
		this.nextSlide = this.nextSlide.bind(this);
	}

	async nextSlide() {
		await this.slideTo(this.currentSlideIndex + 1);
	}

	async prevSlide() {
		await this.slideTo(this.currentSlideIndex - 1);
	}

	initAutoSliding(interval = this.autoSlidingInterval) {
		this.autoSlidingInterval = interval;
		this.breakAutoSliding();
		this.startAutoSliding();

		[this.sliderElem, ...this.nextBtns, ...this.prevBtns].forEach(elem => {
			elem.addEventListener('mouseenter', this.stopAutoSliding);
			elem.addEventListener('mouseleave', this.startAutoSliding);
		});
	}

	startAutoSliding() {
		this.stopAutoSliding();
		this.autoSlidingIntervalKey = setInterval(this.nextSlide, this.autoSlidingInterval);
	}

	stopAutoSliding() {
		clearInterval(this.autoSlidingIntervalKey);
	}

	breakAutoSliding() {
		this.stopAutoSliding();

		[this.sliderElem, ...this.nextBtns, ...this.prevBtns].forEach(elem => {
			elem.removeEventListener('mouseenter', this.stopAutoSliding);
			elem.removeEventListener('mouseleave', this.startAutoSliding);
		});
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

	async slideTo(slideIndex, animationType = this.animationType) {
		const newSlideIndex = this.getValidSlideIndex(slideIndex);

		if (this.isChangingSlides) return;
		if (this.currentSlideIndex === newSlideIndex) {
			this.addActiveClass(this.currentSlide);
			return;
		}

		this.isChangingSlides = true;

		const prevSlide = this.currentSlide;
		const prevSlideIndex = this.getSlideIndex(prevSlide);
		const newSlide = this.getSlide(newSlideIndex);

		this.removeActiveClass(prevSlide);
		this.addActiveClass(newSlide);

		let isForwardDirection = prevSlideIndex < newSlideIndex;

		// if sliding from last slide to first slide or from first to last
		isForwardDirection =
			Math.abs(prevSlideIndex - newSlideIndex) === this.slides.length - 1
				? !isForwardDirection
				: isForwardDirection;

		let slidesDiff = Math.abs(prevSlideIndex - newSlideIndex);

		// if sliding from last slide to first slide or from first to last
		// we slide in one step, not through all slides
		slidesDiff = slidesDiff === this.slides.length - 1 ? 1 : slidesDiff;

		const slidePosition = this.slides.indexOf(this.getSlide(newSlideIndex));

		// if it is backward direction we need to move slides elements before animation start
		if (isForwardDirection) {
			await runAnimation.call(this, animationType);
			updateSlidesSequence.call(this);
			await render();
		} else {
			updateSlidesSequence.call(this);
			await render();
			await runAnimation.call(this, animationType);
		}

		this.isChangingSlides = false;
		this.dispatchSlideChangedEvent();

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

		async function runAnimation(type) {
			switch (type) {
				case 'none':
					break;
				case 'glide':
					await glideAnimation.call(this);
					break;
				case 'opacity':
					await opacityAnimation.call(this);
					break;
				// no default
			}
		}

		async function glideAnimation() {
			const activeSlideStepSize =
				this.orientation === 'X'
					? +(
							((this.activeSlideWidth + this.spaceBetween) / this.slidesContainerWidth) *
							100
					  ).toFixed(4)
					: +(
							((this.activeSlideHeight + this.spaceBetween) / this.slidesContainerHeight) *
							100
					  ).toFixed(4);

			const slideStepSize =
				this.orientation === 'X'
					? +(((this.slideWidth + this.spaceBetween) / this.slidesContainerWidth) * 100).toFixed(4)
					: +(((this.slideHeight + this.spaceBetween) / this.slidesContainerHeight) * 100).toFixed(
							4,
					  );

			// for slides with different active and regular width,
			// step size depends on sliding direction
			// if is slides backward we need to consider active slide width
			const slidePercent = isForwardDirection
				? slideStepSize * slidesDiff
				: activeSlideStepSize + slideStepSize * (slidesDiff - 1);

			const keyFrames = [
				{ transform: `translate${this.orientation}(0)`, position: 'absolute' },
				{ transform: `translate${this.orientation}(-${slidePercent}%)`, position: 'absolute' },
			];

			return this.slidesContainer.animate(isForwardDirection ? keyFrames : keyFrames.reverse(), {
				duration: this.duration,
				easing: this.timingFunction,
			}).finished;
		}

		async function opacityAnimation() {
			const prevSlideAnimationKeyFrames = [
				{ opacity: 1, position: 'absolute' },
				{ opacity: 0, position: 'absolute' },
			];

			const newSlideAnimationKeyFrames = [{ opacity: 0 }, { opacity: 1 }];

			const animationOptions = {
				duration: this.duration,
				easing: this.timingFunction,
			};

			return Promise.all([
				prevSlide.animate(prevSlideAnimationKeyFrames, animationOptions).finished,
				newSlide.animate(newSlideAnimationKeyFrames, animationOptions).finished,
			]);
		}
	}
}
