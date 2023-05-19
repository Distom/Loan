import VideoCard from './VideoCard';

export default class VideoCardsList {
	cards = {};

	constructor({ container, cardSelector, activeClass }) {
		this.container = container;
		this.cardSelector = cardSelector;
		this.activeClass = activeClass;
		this.init();
	}

	init() {
		this.fillCards();
		this.initListeners();
	}

	initListeners() {
		document.addEventListener('videoEnded', this.activateNextCard.bind(this));
	}

	fillCards() {
		let nextCard = null;

		Array.from(this.container.querySelectorAll(this.cardSelector))
			.reverse()
			.forEach(card => {
				const videoCard = new VideoCard(card, this.activeClass);
				this.cards[videoCard.videoId] = videoCard;

				videoCard.nextCard = nextCard;
				nextCard = videoCard;
			});
	}

	activateNextCard(event) {
		const card = this.cards[event.detail.videoId];
		card?.nextCard?.activate();
	}
}
