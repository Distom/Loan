import Slider from './js/Slider';

const mainSlider = new Slider({
	sliderElemSelector: '.moduleapp',
	slidesContainerSelector: '.moduleapp .moduleapp__slides',
	nextBtnsSelector: '.next',
	prevBtnsSelector: '.prev',
	timingFunction: 'ease-in-out',
	animationType: 'opacity',
});
