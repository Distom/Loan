export default class FileDownloader {
	constructor({ button, filePath }) {
		this.button = button;
		this.filePath = filePath;

		this.init();
	}

	init() {
		this.button.addEventListener('click', this.download.bind(this));
	}

	download() {
		const linkElem = document.createElement('a');
		linkElem.href = this.filePath;
		linkElem.download = this.filePath.split('/').at(-1);
		linkElem.style.display = 'none';
		linkElem.dataset.ignoreRouter = true;

		document.body.append(linkElem);
		linkElem.click();
		linkElem.remove();
	}
}
