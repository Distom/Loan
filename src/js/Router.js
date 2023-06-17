/* eslint-disable no-debugger */
import Slider from './Slider';
import { bindAll } from './utils';

export default class Router {
	constructor({ sliders, routes, mainRoute }) {
		this.sliders = sliders;
		this.routes = routes;
		this.mainRoute = mainRoute;
		// this.repositoryRegEx = /.+?(?=\/)/;
		// this.repositoryPath = window.location.pathname.match(this.repositoryRegEx) || '';
		this.repositoryPath = '';
		this.init();
	}

	get currentPath() {
		const path = window.location.pathname;
		// path = path.replace(this.repositoryRegEx, '');
		return path;
	}

	init() {
		bindAll(this);
		this.saveCurrentHTMLPage();
		const originalRoute = localStorage.getItem('originalRoute');

		if (originalRoute) {
			window.history.pushState({}, '', originalRoute);
			localStorage.removeItem('originalRoute');
		}

		window.addEventListener('popstate', this.handleLocation);
		document.addEventListener('click', this.onClick);

		this.handleLocation();
	}

	saveCurrentHTMLPage() {
		this.currentHTMLPage = this.currentPath === '/' ? 'index.html' : this.currentPath.slice(1);
	}

	onClick(event) {
		const link = event.target.closest('a');
		if (!link) return;
		if (!link.href || link.href === '#' || link.dataset.ignoreRouter) return;

		event.preventDefault();
		this.route(link.getAttribute('href'));
	}

	route(path) {
		window.history.pushState({}, '', `${this.repositoryPath}${path}`);
		this.handleLocation();
	}

	handleLocation() {
		let path;

		if (this.currentPath === '/' || !this.routes[this.currentPath]) {
			path = this.mainRoute;
			window.history.replaceState({}, '', `${this.repositoryPath}${path}`);
		} else {
			path = this.currentPath;
		}

		this.loadHTMLPage(path);

		if (!this.pageSlider) {
			this.pageSlider = new Slider(this.sliders[this.currentHTMLPage]);
			this.pageSlider.slideTo(this.routes[path].slideIndex, 'none');
		} else {
			this.pageSlider.slideTo(this.routes[path].slideIndex);
		}
	}

	loadHTMLPage(path) {
		const routeHTMLPage = this.routes[path].htmlPage;
		if (this.currentHTMLPage === routeHTMLPage) return;

		this.passOriginalRoute();
		window.location.replace(`${window.location.origin}${this.repositoryPath}/${routeHTMLPage}`);
	}

	passOriginalRoute() {
		localStorage.setItem('originalRoute', this.currentPath);
	}
}
