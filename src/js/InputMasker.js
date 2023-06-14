import PhoneMask from './PhoneMask';

export default class InputMasker {
	constructor() {
		this.latins = document.querySelectorAll('[data-mask="latin"]');
		this.phones = document.querySelectorAll('[data-mask="phone"]');

		this.init();
	}

	init() {
		this.latins.forEach(latin => latin.addEventListener('input', this.latinMask.bind(this)));

		this.phones.forEach(
			phone =>
				new PhoneMask({
					input: phone,
					phoneMask: '+1 (___) ___-____',
				}),
		);
	}

	latinMask(event) {
		const input = event.target;
		input.value = input.value.replace(/[^\P{L}a-zA-Z]/gu, '');
	}
}
