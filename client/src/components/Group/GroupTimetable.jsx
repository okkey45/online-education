import React, { useState, useContext, useCallback, useEffect } from 'react';
//import { useHistory } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { Loader } from '../Loader/Loader';

import { Form, Button } from 'react-bootstrap';

export const GroupTimetable = ({ trainingId }) => {
	const { loading, request } = useHttp();
	//const history = useHistory();
	const { token } = useContext(AuthContext);
	const [subjects, setSubjects] = useState();
	const [timetableForm, setTimetableForm] = useState({});

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
		[token, request, trainingId],
	);

	useEffect(() => {
		getSubjects(trainingId);
	}, [getSubjects, trainingId]);

	const changeHandler = (event) => {
		console.log(event.target);
		setTimetableForm({
			...timetableForm,
			[event.target.name]: event.target.value,
		});
	};

	if (loading || !subjects) return <Loader />;

	return (
		<div className="table-responsive">
			<table className="table table-hover mb-0">
				<thead>
					<tr>
						<th>Тема</th>
						<th>Дата</th>
					</tr>
				</thead>
				<tbody>
					{subjects.map((el, i) => {
						return (
							<tr key={i}>
								<td>{el.title}</td>
								<td className="text-nowrap">
									<Form.Group controlId={`inputDate_${el._id}`}>
										<Form.Control
											type="date"
											name={el._id}
											value={timetableForm.start_date}
											onChange={changeHandler}
										/>
									</Form.Group>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};
