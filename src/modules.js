import Slider from './js/Slider';
import VideoCardsList from './js/VideoCardsList';

const mainSlider = new Slider({
	sliderElemSelector: '.moduleapp',
	slidesContainerSelector: '.moduleapp .moduleapp__slides',
	nextBtnsSelector: '.next',
	prevBtnsSelector: '.prev',
	timingFunction: 'ease-in-out',
	animationType: 'opacity',
});

document.querySelectorAll('.module').forEach(moduleElem => {
	const moduleVideos = moduleElem.querySelector('.module__video');
	const videoCardsList = new VideoCardsList({
		container: moduleVideos,
		cardSelector: '.module__video-item',
		activeClass: 'module__video-item_active',
	});
});
