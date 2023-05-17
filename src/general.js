import './assets/style/style.sass';
import './index.html';
import './modules.html';

if ('scrollRestoration' in window.history) {
	window.history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
