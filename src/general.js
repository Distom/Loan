import './assets/style/style.sass';
import './modules.html';
import './index.html';
import YoutubePlayer from './js/YoutubePlayer';
import InputMasker from './js/InputMasker';
import AJAXForm from './js/AJAXForm';
import Router from './js/Router';

if ('scrollRestoration' in window.history) {
	window.history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => document.body.classList.remove('transition-lock'));

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

const router = new Router({
	sliders: {
		'index.html': {
			sliderElemSelector: '.page',
			slidesContainerSelector: '.page .page__slides',
			/* nextBtnsSelector: '.next', */
			vertical: true,
			animationType: 'glide',
			timingFunction: 'ease-in-out',
			duration: 1000,
		},
		'modules.html': {
			sliderElemSelector: '.moduleapp',
			slidesContainerSelector: '.moduleapp .moduleapp__slides',
			/* nextBtnsSelector: '.next',
			prevBtnsSelector: '.prev', */
			timingFunction: 'ease-in-out',
			animationType: 'opacity',
		},
	},
	routes: {
		'/showup': {
			htmlPage: 'index.html',
			slideIndex: 0,
		},
		'/difference': {
			htmlPage: 'index.html',
			slideIndex: 1,
		},
		'/modules': {
			htmlPage: 'index.html',
			slideIndex: 2,
		},
		'/join': {
			htmlPage: 'index.html',
			slideIndex: 3,
		},
		'/feed': {
			htmlPage: 'index.html',
			slideIndex: 4,
		},
		'/schedule': {
			htmlPage: 'index.html',
			slideIndex: 5,
		},

		'/modules/1': {
			htmlPage: 'modules.html',
			slideIndex: 0,
		},
		'/modules/2': {
			htmlPage: 'modules.html',
			slideIndex: 1,
		},
		'/modules/3': {
			htmlPage: 'modules.html',
			slideIndex: 2,
		},
		'/modules/4': {
			htmlPage: 'modules.html',
			slideIndex: 3,
		},
		'/modules/5': {
			htmlPage: 'modules.html',
			slideIndex: 4,
		},
		'/modules/6': {
			htmlPage: 'modules.html',
			slideIndex: 5,
		},
		'/modules/7': {
			htmlPage: 'modules.html',
			slideIndex: 6,
		},
		'/modules/8': {
			htmlPage: 'modules.html',
			slideIndex: 7,
		},
	},
	mainRoute: '/showup',
});
