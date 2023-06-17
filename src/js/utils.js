function render(waitTime) {
	if (Number.isFinite(waitTime)) {
		return new Promise(resolve => {
			setTimeout(resolve, waitTime);
		});
	}
	return new Promise(resolve => {
		requestAnimationFrame(resolve);
	});
}

function bindAll(obj) {
	const prototype = Object.getPrototypeOf(obj);
	Object.getOwnPropertyNames(prototype).forEach(key => {
		if (key === 'constructor' || typeof obj[key] !== 'function') return;
		obj[key] = obj[key].bind(obj);
	});
}

export { render, bindAll };
