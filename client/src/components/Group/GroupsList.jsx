import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { Loader } from '../Loader/Loader';
import { GroupsListItem } from './GroupsListItem';

export const GroupsList = () => {
	const { loading, request } = useHttp();
	const [teachers, setTeachers] = useState();
	const [groups, setGroups] = useState();
	const [usersGroups, setUsersGroups] = useState();
	const { token } = useContext(AuthContext);

	const getUsers = useCallback(async () => {
		try {
			const data = await request('/api/user', 'GET', null, {
				Authorization: `Bearer ${token}`,
			});

			const teachers = data.filter((user) => user.roles.includes('teacher'));
			setTeachers(teachers);
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

	if (loading || !groups || !usersGroups || !teachers) {
		return <Loader />;
	}

	return (
		<div className="widget__wrapper has-shadow">
			<div className="widget__body">
				<GroupsListItem
					groups={groups}
					usersGroups={usersGroups}
					teachers={teachers}
				/>
			</div>
		</div>
	);
};
