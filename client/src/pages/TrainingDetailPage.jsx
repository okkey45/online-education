import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Loader } from '../components/Loader/Loader';
import { TrainingDetail } from '../components/Training/TrainingDetail';
import { SubjectList } from '../components/Subject/SubjectList';

import { Col } from 'react-bootstrap';

export const TrainingDetailPage = () => {
	const trainingId = useParams().id;
	const [training, setTraining] = useState([]);
	const { loading, request } = useHttp();
	const { token } = useContext(AuthContext);

	const getTraining = useCallback(async () => {
		try {
			const data = await request(`/api/training/${trainingId}`, 'GET', null, {
				Authorization: `Bearer ${token}`,
			});
			setTraining(data);
		} catch (e) {}
	}, [token, request, trainingId]);

	useEffect(() => {
		getTraining();
	}, [getTraining]);

	if (loading || !training) return <Loader />;

	return (
		<Layout
			page={{
				name: String(training.title),
				title: `${training.title} - MyNewLife club`,
			}}
			content={<TrainingDetail training={training} />}
		/>
	);
};
