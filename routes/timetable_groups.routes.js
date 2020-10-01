const { Router } = require('express');
const Timetable_Groups = require('../models/Timetable_Groups');
const auth = require('../middleware/auth.middleware');
const router = Router();

router.post('/create', auth, async (req, res) => {
	try {
		const { group_id, timetable } = req.body;

		const timetableGroup = new Timetable_Groups({
			group_id,
			timetable,
		});

		await timetableGroup.save();
		res.status(201).json(timetableGroup);
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
});

router.get('/:id', auth, async (req, res) => {
	try {
		const timetableGroup = await Timetable_Groups.findById(req.params.id);
		res.json(timetableGroup);
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
});

module.exports = router;
