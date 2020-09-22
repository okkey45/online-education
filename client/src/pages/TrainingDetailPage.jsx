import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { Loader } from '../components/Loader/Loader';
import { SubjectList } from '../components/Subject/SubjectList';

import { Col } from 'react-bootstrap';

export const TrainingDetailPage = () => {
	const trainingId = useParams().id;
	const [training, setTraining] = useState([]);
	const [subjects, setSubjects] = useState([]);
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

	const getSubjects = useCallback(
		async (trainingId) => {
			if (!trainingId) return;
			try {
				const data = await request(
					`/api/subject/training/${trainingId}`,
					'GET',
					null,
					{
						Authorization: `Bearer ${token}`,
					},
				);
				setSubjects(data);
			} catch (e) {}
		},
		[token, request],
	);

	useEffect(() => {
		getSubjects(training._id);
	}, [getSubjects, training]);

	return (
		<Layout
			page={{
				name: String(training.title),
				title: `${training.title} - MyNewLife club`,
			}}
			content={
				<>
					{(loading || !training || !subjects) && <Loader />}
					{!loading && training && subjects && (
						<>
							<Col xl={3}>
								{!loading && subjects && (
									<div className="widget__wrapper has-shadow">
										<SubjectList
											subjects={subjects}
											trainingId={trainingId}
											trainingTitle={training.title}
										/>
									</div>
								)}
							</Col>
							<Col xl={9}>
								<div className="widget__wrapper has-shadow">
									<div className="widget__header">
										<h4 className="widget__title">Описание тренинга</h4>
									</div>
									<div className="widget__body">
										<p>{training.description}</p>
									</div>
								</div>
							</Col>
						</>
					)}
				</>
			}
		/>
	);
};
