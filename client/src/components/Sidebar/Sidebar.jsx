import React, { useContext, useState, useCallback, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hook';

import { Loader } from '../Loader/Loader';
import { Nav } from 'react-bootstrap';
import { ReactComponent as IconUsers } from '../../img/users.svg';
import { ReactComponent as IconUser } from '../../img/user.svg';
import { ReactComponent as IconFile } from '../../img/file.svg';
import { ReactComponent as OpenBook } from '../../img/open-book.svg';
import { ReactComponent as LogOut } from '../../img/logout.svg';

export const Sidebar = (props) => {
	const history = useHistory();
	const auth = useContext(AuthContext);
	const [userGroups, setUserGroups] = useState();
	const { loading, request } = useHttp();

	const dropdownToggler = (event) => {
		event.target.closest('.sb-dropdown').classList.toggle('open');
	};

	const getUserGroups = useCallback(async () => {
		try {
			const data = await request(
				`/api/user_groups/${auth.userId}`,
				'GET',
				null,
				{
					Authorization: `Bearer ${auth.token}`,
				},
			);

			setUserGroups(data.group_ids);
		} catch (e) {}
	}, [auth.token, auth.userId, request]);

	useEffect(() => {
		getUserGroups();
	}, [getUserGroups]);

	const logoutHandler = (event) => {
		event.preventDefault();
		auth.logout();
		history.push('/');
	};

	if (loading || !userGroups) {
		return <Loader />;
	}

	return (
		<div className="sidebar sidebar__default">
			<div className={`side-navbar${props.sidebarShrink ? ' shrink' : ''}`}>
				<Nav className="side-navbar__list flex-column flex-nowrap">
					{userGroups.includes('5f53768c623f050aa4a2f3aa') && (
						<li className="side-navbar__item sb-dropdown">
							<span
								className="side-navbar__link sb-dropdown__toggler"
								onClick={dropdownToggler}
							>
								<IconUsers className="side-navbar__icon icon-group" />
								<span className="side-navbar__link--title">Пользователи</span>
							</span>
							<ul className="nav sb-dropdown__menu flex-column">
								<li className="nav-item sb-dropdown__item">
									<Link to="/groups" className="sb-dropdown__link">
										Группы
									</Link>
								</li>
								<li className="nav-item sb-dropdown__item">
									<Link to="/users" className="sb-dropdown__link">
										Пользователи
									</Link>
								</li>
								<li className="nav-item sb-dropdown__item">
									<Link to="/user/create" className="sb-dropdown__link">
										Добавить пользователя
									</Link>
								</li>
							</ul>
						</li>
					)}
					<li className="side-navbar__item">
						<Link to="/profile" className="side-navbar__link">
							<IconUser className="side-navbar__icon icon-user" />
							<span className="side-navbar__link--title">Профиль</span>
						</Link>
					</li>
					<li className="side-navbar__item">
						<Link to="/training/create" className="side-navbar__link">
							<IconFile className="side-navbar__icon icon-user" />
							<span className="side-navbar__link--title">Добавить тренинг</span>
						</Link>
					</li>
					<li className="side-navbar__item sb-dropdown">
						<span
							className="side-navbar__link sb-dropdown__toggler"
							onClick={dropdownToggler}
						>
							<OpenBook className="side-navbar__icon icon-edu" />
							<span className="side-navbar__link--title">Обучение</span>
						</span>
						<ul className="nav sb-dropdown__menu flex-column">
							<li className="nav-item sb-dropdown__item">
								<Link to="/trainings" className="sb-dropdown__link">
									Тренинги
								</Link>
							</li>
						</ul>
					</li>
					<li className="side-navbar__item">
						<a href="/" className="side-navbar__link" onClick={logoutHandler}>
							<LogOut className="side-navbar__icon icon-logout" />
							<span className="side-navbar__link--title">Выход</span>
						</a>
					</li>
				</Nav>
			</div>
		</div>
	);
};
