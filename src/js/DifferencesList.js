export default class DifferencesList {
	lastCardIndex = 0;

	constructor({ container, cardSelector, buttonSelector, cardActiveClass, emptyHiddenClass }) {
		this.container = container;
		this.button = this.container.querySelector(buttonSelector);
		this.cardActiveClass = cardActiveClass;
		this.emptyHiddenClass = emptyHiddenClass;

		this.cards = Array.from(this.container.querySelectorAll(cardSelector));
		this.emptyCard = this.cards.pop();

		this.init();
	}

	init() {
		this.button.addEventListener('click', this.showNewCard.bind(this));
	}

	showNewCard() {
		if (this.lastCardIndex === this.cards.length - 1) {
			this.button.style.pointerIvents = 'none';
			this.emptyCard.classList.add(this.emptyHiddenClass);
		}

		this.cards[this.lastCardIndex].classList.add(this.cardActiveClass);
		this.lastCardIndex += 1;
	}
}
