import React from 'react';
import { Link } from 'react-router-dom';
// import { Loader } from '../Loader/Loader';

export const GroupsListItem = ({ groups, usersGroups, teachers }) => {
	const findTeacher = (groupId) => {
		const group = usersGroups.find((el) => el.group_ids.includes(groupId));
		const teacher = teachers.find((el) => el._id === group.user_id);

		return teacher.name;
	};

	return (
		<div className="table-responsive">
			<table className="table table-hover mb-0">
				<thead>
					<tr>
						<th>Код</th>
						<th>Название</th>
						<th>Описание</th>
						<th>Преподаватель</th>
						<th>Действия</th>
					</tr>
				</thead>
				<tbody>
					{groups.map((el, i) => {
						return (
							<tr key={i}>
								<td className="text-nowrap">{el.character_code}</td>
								<td>{el.name}</td>
								<td>{el.description}</td>
								<td>{findTeacher(el._id)}</td>
								<td className="td-actions">
									<Link to={`/group/${el._id}`} className="td-actions__link">
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
