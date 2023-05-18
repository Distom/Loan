/* eslint-disable no-undef */
export default class YoutubePlayer {
	constructor({ overlaySelector, containerId, activeClass, showBtnsSelector, closeBtnsSelector }) {
		this.overlay = document.querySelector(overlaySelector);
		this.showBtns = document.querySelectorAll(showBtnsSelector);
		this.closeBtns = document.querySelectorAll(closeBtnsSelector);
		this.activeClass = activeClass;
		this.containerId = containerId;
		this.init();
	}

	init() {
		this.initYoutubePlayer();
		this.initBtns();
		this.initPlayerEvents();
	}

	initYoutubePlayer() {
		const script = document.createElement('script');
		script.src = 'https://www.youtube.com/iframe_api';
		document.body.append(script);

		window.onYouTubeIframeAPIReady = () => {
			this.player = new YT.Player(this.containerId, {
				height: '480',
				width: '720',
				events: {
					onStateChange: onPlayerStateChange,
				},
			});

			this.playerElem = document.getElementById(this.containerId);
		};
	}

	initPlayerEvents() {
		window.onPlayerStateChange = event => {
			const states = ['videoEnded', 'videoPlaying', 'videoPaused'];
			const currentState = states[event.data];
			if (!currentState) return;

			this.overlay.dispatchEvent(
				new CustomEvent(currentState, {
					bubbles: true,
					detail: {
						videoId: this.videoId,
					},
				}),
			);
		};
	}

	initBtns() {
		this.showBtns.forEach(btn =>
			btn.addEventListener('click', event => {
				event.preventDefault();

				const newVideoLoaded = this.loadVideo(btn.dataset.videoId);
				if (!newVideoLoaded) this.player.playVideo();

				this.show();
			}),
		);

		this.closeBtns.forEach(btn =>
			btn.addEventListener('click', event => {
				event.preventDefault();

				this.player.pauseVideo();
				this.hide();
			}),
		);
	}

	loadVideo(id) {
		if (this.videoId === id) return false;

		this.videoId = id;
		this.player.loadVideoById(id);
		return true;
	}

	show() {
		if (this.overlay.classList.contains(this.activeClass)) return;
		this.overlay.classList.add(this.activeClass);
	}

	hide() {
		this.overlay.classList.remove(this.activeClass);
	}
}
