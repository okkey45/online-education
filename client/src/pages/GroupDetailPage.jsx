import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Loader } from '../components/Loader/Loader';
import { GroupDetail } from '../components/Group/GroupDetail';

import { Col } from 'react-bootstrap';

export const GroupDetailPage = (props) => {
	const groupId = useParams().id;
	const [group, setGroup] = useState([]);
	const [trainingId, setTrainingId] = useState();
	const [training, setTraining] = useState([]);
	const [teacherId, setTeacherId] = useState();
	const [teacher, setTeacher] = useState([]);
	const [users, setUsers] = useState();
	const { loading, request } = useHttp();
	const { token } = useContext(AuthContext);

	const getGroup = useCallback(async () => {
		if (!groupId) return;
		try {
			const data = await request(`/api/group/${groupId}`, 'GET', null, {
				Authorization: `Bearer ${token}`,
			});
			setGroup(data);
			setTrainingId(data.training_id);
			setTeacherId(data.teacher_id);
		} catch (e) {}
	}, [token, request, groupId]);

	useEffect(() => {
		getGroup();
	}, [getGroup, groupId]);

	const getTraining = useCallback(async () => {
		if (!trainingId) return;
		try {
			const data = await request(`/api/training/${trainingId}`, 'GET', null, {
				Authorization: `Bearer ${token}`,
			});
			setTraining(data);
		} catch (e) {}
	}, [token, request, trainingId]);

	useEffect(() => {
		getTraining();
	}, [getTraining, trainingId]);

	const getTeacher = useCallback(async () => {
		if (!teacherId) return;
		try {
			const data = await request(`/api/user/${teacherId}`, 'GET', null, {
				Authorization: `Bearer ${token}`,
			});
			setTeacher(data);
		} catch (e) {}
	}, [token, request, teacherId]);

	useEffect(() => {
		getTeacher();
	}, [getTeacher, teacherId]);

	const getUsers = useCallback(async () => {
		try {
			const data = await request(`/api/user`, 'GET', null, {
				Authorization: `Bearer ${token}`,
			});

			const filteredUser = data.filter((user) => {
				if (group.students_ids.find((st) => st === user._id)) return user;
			});
			setUsers(filteredUser);
		} catch (e) {}
	}, [token, request, group]);

	useEffect(() => {
		getUsers();
	}, [getUsers, group]);

	if (loading || !group || !training || !teacher || !users) {
		return <Loader />;
	}

	return (
		<Layout
			page={{
				name: String(`Группа: ${group.name}`),
				title: `${group.name} - Education Online`,
			}}
			content={
				<GroupDetail training={training} teacher={teacher} users={users} />
			}
		/>
	);
};
