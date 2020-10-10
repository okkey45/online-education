const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const config = require('config');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');
const router = Router();
const nodemailer = require('nodemailer');

const sendUserMail = async (userName, userEmail, userPass) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.yandex.ru',
		port: 465,
		secure: true,
		auth: {
			user: config.get('mailerUser'),
			pass: config.get('mailerPass'),
		},
	});

	const info = await transporter.sendMail({
		from: `Online Education 📚 ${config.get('mailerFrom')}`, // sender address
		to: userEmail, // list of receivers
		subject: `Hello ${userName} ! Your registration data inside ✔️`, // Subject line
		//text: 'Hello world?', // plain text body
		html: `
			<h2>Ваши учетные данные</h2>
			<p>Для входа в приложение используйте следующие данные:</p>
			<p>Страница входа в приложение: ${config.get('baseUrl')}/login</p>
			<p>Логин: ${userEmail}</p>
			<p>Пароль: ${userPass}</p>
		`, // html body
	});

	console.log('Message sent: %s', info.messageId);
};

router.get('/', auth, async (req, res) => {
	try {
		const user = await User.find();
		res.json(user);
	} catch (e) {
		console.log('users_get__', e);
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
});

router.get('/:id', auth, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		res.json(user);
	} catch (e) {
		console.log('user_get_by_id__', e);

		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
});

router.put('/change/:id', auth, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (user) {
			const _roles = user.roles;

			const _currentRole = _roles.find((role) => role === req.body.role);
			if (_currentRole) {
				res.json({
					status: false,
					message: 'У данного пользователя уже есть эта роль',
				});
			} else {
				_roles.push(req.body.role);
				await user.updateOne({ roles: _roles });
				res.json({ status: true });
			}
		}
	} catch (e) {
		console.log('users_roles_change_by_id__', e);
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
});

router.post(
	'/create',
	[
		auth,
		check('name', 'Минимальная длина 3 символа').isLength({ min: 3 }),
		check('email', 'Некорректный email').isEmail(),
		check('password', 'Минимальная длина пароля 6 символов').isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Некорректные данные при регистрации',
				});
			}

			const { name, email, password, roles } = req.body;

			const rolesArr = [];
			roles ? rolesArr.push('all', roles) : rolesArr.push('all');

			const candidate = await User.findOne({ email });

			if (candidate) {
				return res
					.status(400)
					.json({ message: 'Такой пользователь уже существует' });
			}

			const hashedPassword = await bcrypt.hash(password, 12);
			const user = new User({
				name,
				email,
				password: hashedPassword,
				roles: rolesArr,
			});

			await user.save();

			// Отправляем пользователю письмо
			sendUserMail(name, email, password).catch(console.error);

			res.status(201).json(user);
		} catch (e) {
			console.log('user_post__', e);
			res
				.status(500)
				.json({ message: 'Что-то пошло не так, попробуйте снова' });
		}
	},
);

module.exports = router;
