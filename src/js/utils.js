export default function render(waitTime) {
	if (Number.isFinite(waitTime)) {
		return new Promise(resolve => {
			setTimeout(resolve, waitTime);
		});
	}
	return new Promise(resolve => {
		requestAnimationFrame(resolve);
	});
}
