import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { AnswersStudent } from '../Answers/AnswersStudent.jsx';

export const SubjectDetail = ({ subject }) => {
	const { loading, request } = useHttp();
	const [users, setUsers] = useState([]);
    const { token } = useContext(AuthContext);


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

	return (	
		<div className="widget__wrapper has-shadow">
			<div className="widget__header">
				<h4 className="widget__title">{subject.title}</h4>
			</div>
			<div className="widget__body">
				<div className="mb-3">{subject.context}</div>
				<div>{ 
						<AnswersStudent />
					}
				</div>
			</div>
		</div>
	);
};
