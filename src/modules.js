import Slider from './js/Slider';
import VideoCardsList from './js/VideoCardsList';
import Toggle from './js/Toggle';
import FileDownloader from './js/FileDownloader';

/* const mainSlider = new Slider({
	sliderElemSelector: '.moduleapp',
	slidesContainerSelector: '.moduleapp .moduleapp__slides',
	nextBtnsSelector: '.next',
	prevBtnsSelector: '.prev',
	timingFunction: 'ease-in-out',
	animationType: 'opacity',
}); */

document.querySelectorAll('.module').forEach(moduleElem => {
	const videos = moduleElem.querySelector('.module__video');
	const videoCardsList = new VideoCardsList({
		container: videos,
		cardSelector: '.module__video-item',
		activeClass: 'module__video-item_active',
	});

	const toggleBtn = moduleElem.querySelector('.module__info-show');
	const toggleContent = moduleElem.querySelector('.module__info-book');
	const toggler = new Toggle({
		button: toggleBtn,
		contentElem: toggleContent,
		activeClass: 'module__info-book_active',
	});

	const downloadBtn = moduleElem.querySelector('.download');
	const fileDownloader = new FileDownloader({
		button: downloadBtn,
		filePath: './assets/img/slide_1_m.jpg',
	});
});
