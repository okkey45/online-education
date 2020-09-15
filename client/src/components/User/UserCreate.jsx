import React, { useState, useCallback, useContext } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';

import { Form, Button } from 'react-bootstrap';

export const UserCreate = () => {
	const { loading, request } = useHttp();
	const { token } = useContext(AuthContext);
	const [user, setUser] = useState();
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
	});

	const getUser = useCallback(
		async (userId) => {
			try {
				const data = await request(`/api/user/${userId}`, 'GET', null, {
					Authorization: `Bearer ${token}`,
				});

				setUser(data);
			} catch (e) {}
		},
		[request],
	);

	const changeHandler = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value });
	};

	const registerHandler = useCallback(async () => {
		try {
			const data = await request('/api/auth/register', 'POST', {
				...form,
			});

			if (data && data.userId) {
				setForm({
					name: '',
					email: '',
					password: '',
				});
			}
			getUser(data.userId);
			//auth.login(data.token, data.userId);
		} catch (e) {}
	}, [request, token, form, getUser]);

	return (
		<div className="widget__wrapper has-shadow">
			<div className="widget__header">
				<h4 className="widget__title">Добавить пользователя</h4>
			</div>
			<div className="widget__body">
				{user && <h4 className="widget__title mb-4">Пользователь добавлен</h4>}
				<Form className="form__create-user">
					<Form.Group controlId="inputName" className="mb-3">
						<Form.Label>Имя</Form.Label>
						<Form.Control
							type="text"
							name="name"
							value={form.name}
							onChange={changeHandler}
						/>
					</Form.Group>
					<Form.Group controlId="inputEmail" className="mb-3">
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="email"
							name="email"
							value={form.email}
							onChange={changeHandler}
						/>
					</Form.Group>
					<Form.Group controlId="inputPassword" className="mb-3">
						<Form.Label>Пароль</Form.Label>
						<Form.Control
							type="password"
							name="password"
							value={form.password}
							onChange={changeHandler}
						/>
					</Form.Group>
					<Button
						className="btn btn-primary btn__gradient btn__grad-danger btn__sign-in"
						type="submit"
						onClick={registerHandler}
						disabled={loading}
					>
						Добавить пользователя
					</Button>
				</Form>
			</div>
		</div>
	);
};
