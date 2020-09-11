import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { Loader } from '../Loader/Loader';
import { TrainingsListItem } from './TrainingsListItem';

export const TrainingsList = () => {
	const { loading, request } = useHttp();
	const [trainings, setTrainings] = useState([]);
	const { token } = useContext(AuthContext);

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

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="widget__body">
			<TrainingsListItem trainings={trainings} />
		</div>
	);
};
