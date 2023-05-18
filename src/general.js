import './assets/style/style.sass';
import './modules.html';
import './index.html';
import YoutubePlayer from './js/YoutubePlayer';

if ('scrollRestoration' in window.history) {
	window.history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);

const youtubePlayer = new YoutubePlayer({
	overlaySelector: '.overlay',
	containerId: 'frame',
	activeClass: 'overlay_visible',
	showBtnsSelector: '[data-video-player-button="play"]',
	closeBtnsSelector: '[data-video-player-button="close"]',
});
