const { Router } = require('express');
const User_Groups = require('../models/User_Groups');
const auth = require('../middleware/auth.middleware');
const router = Router();

router.get('/', auth, async (req, res) => {
	try {
		const user_groups = await User_Groups.find();
		res.json(user_groups);
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
});

router.get('/:id', auth, async (req, res) => {
	try {
		const userGroups = await User_Groups.findOne({ user_id: req.params.id });
		res.json(userGroups);
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
});

module.exports = router;
