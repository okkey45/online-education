import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { Loader } from '../Loader/Loader';
import { GroupsListItem } from './GroupsListItem';

import { Form, Button } from 'react-bootstrap';

export const GroupsList = () => {
	const { loading, request } = useHttp();
	const [groups, setGroups] = useState([]);
	const { token } = useContext(AuthContext);
	const [form, setForm] = useState({
		name: '',
		description: '',
	});

	const changeHandler = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value });
	};

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

	const saveHandler = async (event) => {
		try {
			const data = await request(
				'/api/group/create',
				'POST',
				{ ...form },
				{ Authorization: `Bearer ${token}` },
			);
			setGroups(data);
			setForm({ name: '', description: '' });
			getGroups();
		} catch (e) {}
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<>
			{!loading && groups.length > 0 && (
				<div className="widget__wrapper has-shadow">
					<div className="widget__body">
						<GroupsListItem groups={groups} />
					</div>
				</div>
			)}
			<div className="widget__wrapper has-shadow">
				<div className="widget__header">
					<h4 className="widget__title">Добавить группу пользователей</h4>
				</div>
				<div className="widget__body">
					<Form className="form__createGroup">
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
		</>
	);
};
