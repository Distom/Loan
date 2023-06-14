export default class PhoneMask {
	constructor({ input, phoneMask }) {
		this.input = input;
		this.phoneMask = phoneMask;

		this.init();
	}

	get cursorPosition() {
		return this.input.value.indexOf('_');
	}

	init() {
		this.input.value = this.phoneMask;
		this.prevValue = this.phoneMask;

		this.input.addEventListener('focus', this.updateCursorPosition.bind(this));
		this.input.addEventListener('pointerup', this.updateCursorPosition.bind(this));

		this.input.addEventListener('input', this.onInput.bind(this));
		this.input.addEventListener('keydown', this.onDelete.bind(this));
	}

	updateCursorPosition() {
		const cursorPosition = this.cursorPosition;
		this.input.selectionStart = cursorPosition;
		this.input.selectionEnd = cursorPosition;
	}

	onInput() {
		const newNumbers = [];
		let shift = 0;

		Array.from(this.input.value).forEach((char, index) => {
			if (char === this.prevValue[index - shift]) return;

			shift += 1;
			if (/[0-9]/g.test(char)) {
				newNumbers.push(char);
			}
		});

		this.prevValue = this.prevValue.replace(/_/g, match => {
			if (match !== '_') return match;
			const num = newNumbers.shift();
			if (!num) return '_';
			return num;
		});

		this.input.value = this.prevValue;
		this.updateCursorPosition();
	}

	onDelete(event) {
		if (event.code !== 'Backspace') return;

		this.input.value = Array.from(this.input.value)
			.reverse()
			.join('')
			.replace(/[0-9]/, (match, offset) => {
				const reversedOffset = this.input.value.length - offset - 1;
				if (this.phoneMask[reversedOffset] === '_') return '_';
				return match;
			})
			.split('')
			.reverse()
			.join('');

		this.prevValue = this.input.value;
		this.updateCursorPosition();
	}
}
