const { Router } = require('express');
const slugify = require('@sindresorhus/slugify');
const Training = require('../models/Training');
const auth = require('../middleware/auth.middleware');
const router = Router();

router.post('/create', auth, async (req, res) => {
	try {
		const { title, description } = req.body;
		const code = slugify(title);

		const training = new Training({
			title,
			description,
			code,
			author_id: req.user.userId,
		});

		await training.save();
		res.status(201).json({ training });
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
});

router.get('/', auth, async (req, res) => {
	try {
		//const trainings = await Training.find({ author_id: req.user.userId })
		const trainings = await Training.find();
		res.json(trainings);
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
});

router.get('/:id', auth, async (req, res) => {
	try {
		const training = await Training.findById(req.params.id);
		res.json(training);
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
});

module.exports = router;
