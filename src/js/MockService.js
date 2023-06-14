export default class MockService {
	static postForm(form) {
		return new Promise(resolve => {
			setTimeout(resolve, Math.random() * 1000, { ok: Math.random() > 0.5 });
		});
	}
}
