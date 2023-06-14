import './assets/style/style.sass';
import './modules.html';
import './index.html';
import YoutubePlayer from './js/YoutubePlayer';
import InputMasker from './js/InputMasker';
import AJAXForm from './js/AJAXForm';

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

const inputMasker = new InputMasker();

const AJAXForms = document.querySelectorAll('[data-form-type="AJAX"]');
AJAXForms.forEach(
	form =>
		new AJAXForm({
			form,
			loadingClass: 'form_loading',
			successClass: 'form_success',
			errorClass: 'form_error',
		}),
);
