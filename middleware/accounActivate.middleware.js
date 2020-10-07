const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}

	try {
		const token = req.params.token;

		if (!token) {
			return res
				.status(401)
				.json({ message: 'Некорректная ссылка, или истек срок действия.' });
		}

		const decoded = jwt.verify(token, config.get('jwtActivate'));
		req.user = decoded;

		next();
	} catch (e) {
		res
			.status(401)
			.json({ message: 'Некорректная ссылка, или истек срок действия.' });
	}
};
