import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { Loader } from '../Loader/Loader';
import { UsersListItem } from './UsersListItem';
import { UserItem } from './UserItem';

import { Form, Button } from 'react-bootstrap';

export const UsersList = () => {
	const { loading, request } = useHttp();
	const [users, setUsers] = useState([]);
	const [user, setUser] = useState(null);
	const [usersGroups, setUsersGroups] = useState([]);
	const [groups, setGroups] = useState([]);
	const [selectedUser, setSelectedUser] = useState('');
	const [findUser, setFindUser] = useState('');
	const { token } = useContext(AuthContext);
	const [form, setForm] = useState({
		name: '',
		email: '',
		user_groups: [],
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

	const getUsersGroups = useCallback(async () => {
		try {
			const data = await request(`/api/user_groups`, 'GET', null, {
				Authorization: `Bearer ${token}`,
			});
			setUsersGroups(data);
		} catch (e) {}
	}, [token, request]);

	useEffect(() => {
		getUsersGroups();
	}, [getUsersGroups]);

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

	const getGroupName = (groupId) => {
		let group = [];

		groups.forEach((el) => {
			if (el._id === groupId) {
				group['name'] = el.name;
				group['description'] = el.description;
			}
		});
		return group;
	};

	const getUserGroups = (userId) => {
		const user_groups = usersGroups.filter((group) => group.user_id === userId);
		const userGroupsArr = [];

		if (user_groups[0]) {
			const { group_ids } = user_groups[0];
			group_ids.forEach((id) => {
				const group = getGroupName(id);
				userGroupsArr.push(group);
			});
		}

		return userGroupsArr;
	};

	const selectUserHandler = (event) => {
		const userId = event.target.closest('span').dataset.id;

		if (userId) {
			const filteredUser = users.find((user) => {
				return user._id === userId;
			});
			if (filteredUser) {
				setUser(filteredUser);
			}
		}
	};

	const findUserHandler = (event) => {
		if (event.key === 'Enter' && findUser) {
			const filteredUser = users.find((user) => {
				return user.email.includes(findUser);
			});
			if (filteredUser) {
				setUser(filteredUser);
			}
		}
	};

	// Продумать оптимизацию filteredUser()

	if (loading) {
		return <Loader />;
	}

	return (
		<>
			<div className="widget__wrapper has-shadow">
				<div className="widget__body">
					<UsersListItem
						users={users}
						selectUserHandler={selectUserHandler}
						getUserGroups={getUserGroups}
					/>
				</div>
			</div>
		</>
	);
};
