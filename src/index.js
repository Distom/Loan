import Slider from './js/Slider';

const mainSlider = new Slider({
	sliderElemSelector: '.page',
	slidesContainerSelector: '.page .page__slides',
	nextBtnsSelector: '.next',
	vertical: true,
	animationType: 'glide',
	timingFunction: 'ease-in-out',
	duration: 1000,
});

const sliderBackToStartButtons = document.querySelectorAll('.sidecontrol__label');
sliderBackToStartButtons.forEach(button => {
	button.addEventListener('click', event => {
		event.preventDefault();
		mainSlider.slideTo(0);
	});
});

const showupSlider = new Slider({
	sliderElemSelector: '.showup__content-slider',
	slidesContainerSelector: '.showup__content-slider .showup__slider-slides',
	nextBtnsSelector: '.showup .showup__next',
	prevBtnsSelector: '.showup .showup__prev',
	animationType: 'glide',
	timingFunction: 'ease-in-out',
	activeClass: 'card-active',
	spaceBetween: 24,
	duration: 500,
	autoSliding: true,
});

const modulesSlider = new Slider({
	sliderElemSelector: '.modules__content-slider',
	slidesContainerSelector: '.modules__content-slider .modules__slider-slides',
	nextBtnsSelector: '.modules .slick-next',
	prevBtnsSelector: '.modules .slick-prev',
	timingFunction: 'ease-in-out',
	animationType: 'glide',
	activeClass: 'card-active',
	spaceBetween: 24,
	duration: 500,
	autoSliding: true,
});

const feedSlider = new Slider({
	sliderElemSelector: '.feed__slider',
	slidesContainerSelector: '.feed__slider .feed__slider-slides',
	nextBtnsSelector: '.feed .slick-next',
	prevBtnsSelector: '.feed .slick-prev',
	animationType: 'glide',
	timingFunction: 'ease-in-out',
	activeClass: 'feed__item-active',
	spaceBetween: 32,
	duration: 500,
});
