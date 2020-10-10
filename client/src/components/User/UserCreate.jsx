import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

import { Form, Button } from 'react-bootstrap';

export const UserCreate = () => {
	const { loading, request, errors, clearErrors } = useHttp();
	const { token } = useContext(AuthContext);
	const history = useHistory();
	const [groups, setGroups] = useState([]);
	const [userAddGroup, setUserAddGroup] = useState();
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		roles: '',
	});

	const getGroups = useCallback(async () => {
		try {
			const data = await request('/api/group', 'GET', null, {
				Authorization: `Bearer ${token}`,
			});
			setGroups(data);
		} catch (e) {}
	}, [token, request]);

	useEffect(() => {
		getGroups();
	}, [getGroups]);

	const changeHandler = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value });
		clearErrors();
	};

	const registerHandler = useCallback(async () => {
		try {
			const data = await request(
				'/api/user/create',
				'POST',
				{ ...form },
				{ Authorization: `Bearer ${token}` },
			);

			if (data) history.push(`/user/edit/${data._id}`);
		} catch (e) {}
	}, [request, form]);

	const addUserToGroupHandler = (event) => {
		setUserAddGroup(event.target.value);
	};

	return (
		<div className="widget__wrapper has-shadow">
			<div className="widget__body">
				<Form className="form__create-user">
					<Form.Group controlId="inputName" className="mb-3">
						<Form.Label>Имя</Form.Label>
						<Form.Control
							type="text"
							name="name"
							value={form.name}
							onChange={changeHandler}
						/>
						{errors && errors.length > 0 && (
							<ErrorMessage errors={errors} fieldName="name" />
						)}
					</Form.Group>
					<Form.Group controlId="inputEmail" className="mb-3">
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="email"
							name="email"
							value={form.email}
							onChange={changeHandler}
						/>
						{errors && errors.length > 0 && (
							<ErrorMessage errors={errors} fieldName="email" />
						)}
					</Form.Group>
					<Form.Group controlId="inputPassword" className="mb-3">
						<Form.Label>Пароль</Form.Label>
						<Form.Control
							type="password"
							name="password"
							value={form.password}
							onChange={changeHandler}
						/>
						{errors && errors.length > 0 && (
							<ErrorMessage errors={errors} fieldName="password" />
						)}
					</Form.Group>
					<Form.Group controlId="inputAddRole" className="mb-3">
						<Form.Label>Установить роль пользователя</Form.Label>
						<Form.Control
							as="select"
							name="roles"
							value={form.roles}
							onChange={changeHandler}
						>
							<option value="">Выберите роль пользователя</option>
							<option value="admin">Администратор</option>
							<option value="teacher">Преподаватель</option>
							<option value="curator">Куратор</option>
							<option value="student">Студент</option>
						</Form.Control>
					</Form.Group>
					<Form.Group controlId="inputEditGroup" className="mb-3">
						<Form.Label>Добавить пользователя в группу</Form.Label>
						<Form.Control
							as="select"
							name="user_groups"
							value={userAddGroup}
							onChange={addUserToGroupHandler}
						>
							<option value="">Выберите группу</option>
							{groups.map((el, i) => {
								return (
									<option key={i} value={el._id}>
										{el.name}
									</option>
								);
							})}
						</Form.Control>
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
