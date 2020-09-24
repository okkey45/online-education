import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { Loader } from '../Loader/Loader';

import { Form, Button } from 'react-bootstrap';

export const GroupCreate = () => {
	const { loading, request } = useHttp();
	const history = useHistory();
	const { token } = useContext(AuthContext);
	const [trainings, setTrainings] = useState();
	const [teacher, setTeacher] = useState();
	const [users, setUsers] = useState();
	const [form, setForm] = useState({
		name: '',
		description: '',
		training: '',
		teacher: '',
	});

	const getUsers = useCallback(async () => {
		try {
			const data = await request('/api/user', 'GET', null, {
				Authorization: `Bearer ${token}`,
			});
			setUsers(data);
		} catch (e) {}
	}, [token, request]);

	useEffect(() => {
		getUsers();
	}, [getUsers]);

	const getTrainings = useCallback(async () => {
		try {
			const data = await request('/api/training', 'GET', null, {
				Authorization: `Bearer ${token}`,
			});
			setTrainings(data);
		} catch (e) {}
	}, [token, request]);

	useEffect(() => {
		getTrainings();
	}, [getTrainings]);

	const addUserToGroup = useCallback(
		async (groupId) => {
			try {
				const data = await request(
					`/api/user_groups/change`,
					'PUT',
					{
						user_id: teacher,
						group_id: groupId,
					},
					{
						Authorization: `Bearer ${token}`,
					},
				);
				// Временно - перенаправление на список групп. Продумать добавление Преподавателя и Студентов.
				if (data) history.push('/groups');
			} catch (e) {}
		},
		[token, request, teacher, history],
	);

	const changeHandler = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value });
		setTeacher(form.teacher);
	};

	const saveHandler = async (event) => {
		event.preventDefault();

		try {
			const data = await request(
				'/api/group/create',
				'POST',
				{
					name: form.name,
					description: form.description,
					training_id: form.training,
				},
				{ Authorization: `Bearer ${token}` },
			);

			addUserToGroup(data._id);
		} catch (e) {}
	};

	if (loading || !trainings || !users) {
		return <Loader />;
	}

	return (
		<div className="widget__wrapper has-shadow">
			<div className="widget__header">
				<h4 className="widget__title">Создать группу пользователей</h4>
			</div>
			<div className="widget__body">
				<Form className="form__createGroup">
					<Form.Group controlId="inputSetGroup" className="mb-3">
						<Form.Label>Тренинг</Form.Label>
						<Form.Control
							as="select"
							name="training"
							value={form.training}
							onChange={changeHandler}
						>
							<option value="">Выберите тренинг</option>
							{trainings.length &&
								trainings.map((el, i) => {
									return (
										<option key={i} value={el._id}>
											{el.title}
										</option>
									);
								})}
						</Form.Control>
					</Form.Group>
					<Form.Group controlId="inputSetTeacher" className="mb-3">
						<Form.Label>Преподаватель</Form.Label>
						<Form.Control
							as="select"
							name="teacher"
							value={form.teacher}
							onChange={changeHandler}
						>
							<option value="">Выберите преподавателя</option>
							{users.length &&
								users.map((el, i) => {
									if (el.roles.includes('teacher'))
										return (
											<option key={i} value={el._id}>
												{el.name}
											</option>
										);

									return null;
								})}
						</Form.Control>
					</Form.Group>
					<Form.Group controlId="inputName" className="mb-3">
						<Form.Label>Название группы</Form.Label>
						<Form.Control
							type="text"
							name="name"
							value={form.name}
							onChange={changeHandler}
						/>
					</Form.Group>
					<Form.Group controlId="inputDescription" className="mb-3">
						<Form.Label>Описание группы</Form.Label>
						<Form.Control
							type="text"
							name="description"
							value={form.description}
							onChange={changeHandler}
						/>
						<Form.Text muted>
							Развернутое описание группы для преподавателей и кураторов. Не
							доступно студентам.
						</Form.Text>
					</Form.Group>
					<Button
						className="btn btn-primary btn__gradient btn__grad-danger btn__sign-in"
						type="submit"
						onClick={saveHandler}
						disabled={loading}
					>
						Сохранить
					</Button>
				</Form>
			</div>
		</div>
	);
};
