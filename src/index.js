import Slider from './js/Slider';

const mainSlider = new Slider({
	sliderElemSelector: '.page',
	slidesContainerSelector: '.page .page__slides',
	nextBtnsSelector: '.next',
	prevBtnsSelector: '.sidecontrol__controls-count',
	vertical: true,
	timingFunction: 'ease-in-out',
});

const sliderBackToStartButtons = document.querySelectorAll('.sidecontrol__label');
sliderBackToStartButtons.forEach(button => {
	button.addEventListener('click', event => {
		event.preventDefault();
		mainSlider.slideTo(0);
	});
});

const modulesSlider = new Slider({
	sliderElemSelector: '.modules__content-slider',
	slidesContainerSelector: '.modules__content-slider .modules__slider-slides',
	nextBtnsSelector: '.modules .slick-next',
	prevBtnsSelector: '.modules .slick-prev',
	timingFunction: 'ease-in-out',
	activeClass: 'card-active',
});
