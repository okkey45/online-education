import React from 'react';

export const UserItem = ({ user, getUserGroups }) => {
	const user_groups = getUserGroups(user._id);

	return (
		<div className="table-responsive mb-3">
			<table className="table table-hover mb-0">
				<thead>
					<tr>
						<th>Имя</th>
						<th>Email</th>
						<th>Группы</th>
						<th>Действия</th>
					</tr>
				</thead>
				<tbody>
					<tr key={user._id}>
						<td>{user.name}</td>
						<td>{user.email}</td>
						<td>
							{user_groups.length > 0 &&
								user_groups.map((el, i) => {
									return (
										<span
											key={i}
											title={el.description}
											className="d-block mb-2"
										>
											{el.name}
										</span>
									);
								})}
						</td>
						<td className="td-actions">
							<span
								className="td-actions__link"
								title="Удалить"
								data-id={user._id}
							>
								<i className="la la-close delete"></i>
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};
