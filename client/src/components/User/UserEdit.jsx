import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';

import { Form, Button } from 'react-bootstrap';

export const UserEdit = () => {
	const { loading, request } = useHttp();
	const { token } = useContext(AuthContext);
	const [groups, setGroups] = useState([]);
	const [user, setUser] = useState();
	const [userAddGroup, setUserAddGroup] = useState('');
	const [userRemoveGroup, setUserRemoveGroup] = useState('');
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		roles: '',
	});

	const addUserToGroupHandler = (event) => {
		setUserAddGroup(event.target.value);
	};

	const removeUserFromGroup = (event) => {
		setUserRemoveGroup(event.target.value);
	};

	/* const updateUserGroups = useCallback(() => {
		if (user && usersGroups) {
			const user_groups = usersGroups.filter(
				(group) => group.user_id === user._id,
			);

			const userGroupsObj = user_groups[0];

			const checkGroup = (groupId) => {
				if (userGroupsObj.group_ids.length) {
					return userGroupsObj.group_ids.indexOf(groupId);
				}
			};

			if (checkGroup(userAddGroup) < 0 && userAddGroup)
				userGroupsObj.group_ids.push(userAddGroup);

			if (checkGroup(userRemoveGroup) >= 0 && userRemoveGroup)
				userGroupsObj.group_ids.splice(checkGroup(userRemoveGroup), 1);
		}
	}, [user, usersGroups, userAddGroup, userRemoveGroup]);

	useEffect(() => {
		updateUserGroups();
	}, [updateUserGroups]); */

	return (
		<div className="widget__wrapper widget__user--update has-shadow">
			<div className="widget__header">
				<h4 className="widget__title">Редактировать пользователя</h4>
			</div>
			<div className="widget__body">
				<Form className="form__createGroup">
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
					<Form.Group controlId="inputGroup" className="mb-3">
						<Form.Label>Удалить пользователя из группы</Form.Label>
						<Form.Control
							as="select"
							name="user_groups"
							onChange={removeUserFromGroup}
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
						disabled={loading}
						//onClick={updateUserGroups}
					>
						Сохранить изменения
					</Button>
				</Form>
			</div>
		</div>
	);
};
