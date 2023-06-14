import MockService from './MockService';

export default class AJAXForm {
	constructor({ form, loadingClass, successClass, errorClass }) {
		this.form = form;
		this.loadingClass = loadingClass;
		this.successClass = successClass;
		this.errorClass = errorClass;

		this.init();
	}

	init() {
		this.form.addEventListener('submit', this.onSubmit.bind(this));
	}

	async onSubmit(event) {
		event.preventDefault();
		this.removeClasses();

		this.form.classList.add(this.loadingClass);
		const resp = await MockService.postForm(this.form);
		this.form.classList.remove(this.loadingClass);

		if (resp.ok) {
			this.onSuccess();
		} else {
			this.onError();
		}
	}

	onSuccess() {
		this.form.classList.add(this.successClass);
	}

	onError() {
		this.form.classList.add(this.errorClass);
	}

	removeClasses() {
		this.form.classList.remove(this.loadingClass);
		this.form.classList.remove(this.successClass);
		this.form.classList.remove(this.errorClass);
	}
}
