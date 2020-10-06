const { Router } = require('express');
const Group = require('../models/Group');
const auth = require('../middleware/auth.middleware');
const generateCode = require('../middleware/generateSimbolCode.middleware');
const { check, validationResult } = require('express-validator');
const router = Router();

router.post('/create',
	[auth, generateCode,
	 check('name', 'Минимальная длина 5 символов').isLength({min:5}).trim(),
	 check('description', 'Минимальная длина 30 символов').isLength({min:30}).trim(),
	],
	 async (req, res) => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
				message: 'Некорректные данные при создании группы',
			});
		}

		const {
			name,
			description,
			character_code,
			training_id,
			teacher_id,
			students_ids = [],
		} = req.body;

		const group = new Group({
			name,
			description,
			character_code,
			training_id,
			teacher_id,
			students_ids,
		});

		await group.save();
		res.status(201).json(group);
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
});

router.get('/', auth, async (req, res) => {
	try {
		const groups = await Group.find();
		res.json(groups);
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
});

router.get('/:id', auth, async (req, res) => {
	try {
		const group = await Group.findById(req.params.id)
			.populate('students_ids', ['name', 'email'])
			.populate('teacher_id', 'name')
			.populate('training_id', 'title');
		res.json(group);
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
});

module.exports = router;
