import Slider from './js/Slider';

console.log('Index');

const mainSlider = new Slider({
	containerSelector: '.page',
	nextBtnsSelector: '.next',
	vertical: true,
	timingFunction: 'ease-in-out',
	activeClass: 'test',
});

const sliderBackToStartButtons = document.querySelectorAll('.sidecontrol__label');
sliderBackToStartButtons.forEach(button => {
	button.addEventListener('click', event => {
		event.preventDefault();
		mainSlider.slideTo(0);
	});
});
