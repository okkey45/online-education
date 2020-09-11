import React from 'react';
import { Link } from 'react-router-dom';

export const TrainingsListItem = ({ trainings }) => {
	if (!trainings.length) {
		return <p className="text-center m-0 py-3">Нет доступных тренингов.</p>;
	}

	return (
		<div className="table-responsive">
			<table className="table table-hover mb-0">
				<thead>
					<tr>
						<th>Date</th>
						<th>Training</th>
						<th>Author</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{trainings.map((el, i) => {
						return (
							<tr key={i}>
								<td>{new Date(el.date).toLocaleDateString()}</td>
								<td>
									<Link to={`/training/${el._id}`}>{el.title}</Link>
								</td>
								<td>{el.author_id}</td>
								<td className="td-actions">
									<Link to={`/training/${el._id}`} className="td-actions__link">
										<i className="la la-edit edit"></i>
									</Link>
									<a className="td-actions__link" href="/">
										<i className="la la-close delete"></i>
									</a>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};
