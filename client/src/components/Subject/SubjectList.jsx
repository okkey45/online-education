import React from 'react';
import { Link } from 'react-router-dom';

export const SubjectList = ({
	subjects,
	trainingId,
	trainingTitle,
	deleteSubject,
}) => {
	const today = new Date();

	subjects.sort((a, b) => {
		if (a.start_date > b.start_date) {
			return 1;
		}
		if (a.start_date < b.start_date) {
			return -1;
		}

		return 0;
	});

	if (!subjects.length) {
		return (
			<>
				<div className="widget__header">
					<h4 className="widget__title">Программа тренинга</h4>
				</div>
				<div className="widget__body">
					<Link
						className="btn btn-primary"
						to={{
							pathname: '/subject/create',
							trainingId,
							trainingTitle,
						}}
					>
						Create Subject
					</Link>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="widget__header">
				<h4 className="widget__title">Программа</h4>
			</div>
			<div className="widget__body">
				<ol className="subject__list">
					{subjects.map((el, i) => {
						return (
							<li
								className={`subject__item${
									today >= new Date(el.start_date) ? ' active' : ''
								}`}
								key={i}
							>
								<span className="subject__date">
									{new Date(el.start_date).toLocaleDateString()}
								</span>
								<span className="subject__title">{el.title}</span>
								<Link
									to={`/subject/edit/${el._id}`}
									className="td-actions__link"
								>
									<i className="la la-edit edit"></i>
								</Link>
							</li>
						);
					})}
				</ol>
				{subjects.length && (
					<Link
						className="btn btn-primary"
						to={{
							pathname: '/subject/create',
							trainingId,
							trainingTitle,
						}}
					>
						Add Subject
					</Link>
				)}
			</div>
		</>
	);
};
