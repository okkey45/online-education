const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const accActivate = require('../middleware/accounActivate.middleware');
const User = require('../models/User');
//const User_Groups = require('../models/User_Groups');
const router = Router();
const nodemailer = require('nodemailer');

const sendUserMail = async (userName = '', userEmail, token) => {
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
		from: `"Online Education 👻" ${config.get('mailerFrom')}`, // sender address
		to: userEmail, // list of receivers
		subject: `Hello ${userName} ! Confirm your email ✔`, // Subject line
		//text: 'Hello world?', // plain text body
		html: `
			<h2>Для завершения регистрации перейдите по ссылке:</h2>
			<p><a href="${config.get(
				'baseUrl',
			)}/api/auth/activate/${token}">Активировать аккаунт</a></p>
			<p>При успешном активировании вы будете перенаправлены на страницу авторизации.</p>
			<p>Логин: ${userEmail}</p>
			<p>Пароль: ваш пароль</p>
		`, // html body
	});

	console.log('Message sent: %s', info.messageId);
};

// /api/auth/register
router.post(
	'/register',
	[
		check('name', 'Минимум 3 символа').isLength({ min: 3 }),
		check('email', 'Некорректный email').isEmail(),
		check('password', 'Минимум 6 символов').isLength({ min: 6 }),
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

			const confirmToken = jwt.sign(
				{ name, email, password, rolesArr },
				config.get('jwtActivate'),
				{ expiresIn: '30m' },
			);

			// Отправляем пользователю письмо для активации аккаунта
			sendUserMail(name, email, confirmToken).catch(console.error);

			res.status(200).json({ message: 'Send email', email });
		} catch (e) {
			res
				.status(500)
				.json({ message: 'Что-то пошло не так, попробуйте снова' });
		}
	},
);

// /api/auth/activate/:token
router.get('/activate/:token', accActivate, async (req, res) => {
	try {
		const { name, email, password, rolesArr } = req.user;

		const hashedPassword = await bcrypt.hash(password, 12);
		const user = new User({
			name,
			email,
			password: hashedPassword,
			roles: rolesArr,
		});

		await user.save();

		const token = jwt.sign(
			{ userId: user._id, userRoles: user.roles },
			config.get('jwtSecret'),
			{
				expiresIn: '12h',
			},
		);

		res.redirect(`${config.get('baseUrl')}/login`);
	} catch (e) {
		res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
	}
});

// /api/auth/login
router.post(
	'/login',
	[
		check('email', 'Введите корректный email').normalizeEmail().isEmail(),
		check('password', 'Введите пароль.').exists().isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Некорректные данные при входе в систему',
				});
			}

			const { email, password } = req.body;

			const user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ message: 'Пользователь не найден' });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res
					.status(400)
					.json({ message: 'Не верный пароль, попробуйте снова' });
			}

			const token = jwt.sign(
				{ userId: user.id, userRoles: user.roles },
				config.get('jwtSecret'),
				{
					expiresIn: '12h',
				},
			);

			res.json({ token, userId: user.id });
		} catch (e) {
			res
				.status(500)
				.json({ message: 'Что-то пошло не так, попробуйте снова' });
		}
	},
);

module.exports = router;
