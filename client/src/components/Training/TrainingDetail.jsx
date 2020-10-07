import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import { Col } from 'react-bootstrap';

export const TrainingDetail = ({ training }) => {
	const subjects = training.subject_ids;
	const { userId, userRoles } = useContext(AuthContext);

	if (subjects && subjects.length > 0) {
		subjects.sort((a, b) => {
			if (a.sorting > b.sorting) {
				return 1;
			}
			if (a.sorting < b.sorting) {
				return -1;
			}

			return 0;
		});
	}

	return (
		<>
			<Col xl={3}>
				<div className="widget__wrapper has-shadow">
					<div className="widget__header">
						<h4 className="widget__title">Программа тренинга</h4>
					</div>
					<div className="widget__body">
						<ol className="subject__list">
							{subjects &&
								subjects.length > 0 &&
								subjects.map((el, i) => {
									return (
										<li className="subject__item" key={i}>
											{el.title}
										</li>
									);
								})}
						</ol>
						{userId === training.author_id && (
							<Link
								className="btn btn-primary"
								to={{
									pathname: '/subject/create',
									state: {
										trainingId: training._id,
										trainingTitle: training.title,
									},
								}}
							>
								Create Subject
							</Link>
						)}
					</div>
				</div>
			</Col>
			<Col xl={9}>
				<div className="widget__wrapper has-shadow">
					<div className="widget__header">
						<h4 className="widget__title">Описание тренинга</h4>
					</div>
					<div className="widget__body">
						<div dangerouslySetInnerHTML={{ __html: training.detail_text }} />
					</div>
				</div>
			</Col>
		</>
	);
};
