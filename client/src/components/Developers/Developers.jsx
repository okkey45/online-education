import React, {
	useState,
	useEffect,
	useCallback,
	useContext,
	useRef,
} from 'react';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';

export const Developers = () => {
    const { loading, request } = useHttp();
    const [users, setUsers] = useState([]);
    const [usersGroups, setUsersGroups] = useState([]);
    const [groups, setGroups] = useState([]);
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
    const getUsersGroups = useCallback(async () => {
		try {
			const data = await request(`/api/user_groups`, 'GET', null, {
				Authorization: `Bearer ${token}`,
			});
            setUsersGroups(data);
            
		} catch (e) {}
    }, [token, request]);
    
    useEffect(() => {
		getUsersGroups();
    }, [getUsersGroups]);

    const getGroups = useCallback(async () => {
		try {
			const data = await request('/api/group', 'GET', null, {
				Authorization: `Bearer ${token}`,
			});
			setGroups(data);
		} catch (e) {}
	}, [token, request]);

	useEffect(() => {
		getGroups();
	}, [getGroups]);

	const getGroupName = (groupId) => {
		let group = [];
		groups.forEach((el) => {
			if (el._id === groupId) {
				group['id'] = el._id;
				group['name'] = el.name;
				group['description'] = el.description;
			}
		});
        return group;
	};
    const getUserGroups = (userId) => {
		const user_groups = usersGroups.filter((group) => group.user_id === userId);
		const userGroupsArr = [];

		if (user_groups[0]) {
			const { group_ids } = user_groups[0];
			group_ids.forEach((id) => {
				const group = getGroupName(id);
				userGroupsArr.push(group);
			});
		}
		return userGroupsArr;
	};

    
	return (
		<>
            <div className="table-responsive mb-3">
			<table className="table table-hover mb-0">
				<thead>
					<tr>
						<th>Имя</th>
						<th>Email</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user, i) => {
						const user_groups = getUserGroups(user._id);
							   return ( 
                           			 <>
										{user_groups.length > 0 &&
										user_groups.map((el, i) => {
											if(el.id === '5f53768c623f050aa4a2f3aa') {
											return ( 
												<tr key={user._id}>
														<td>{user.name}</td>
														<td>{user.email}</td>
												</tr>
												)
											}
										})
									}
								</>
							)
						})
					}
				</tbody>
			</table>
		</div>
		</>
	);
};