import React from 'react';
import { Layout } from '../components/Layout/Layout';
import { GroupCreate } from '../components/Group/GroupCreate';

export const GroupCreatePage = () => {
	return (
		<Layout
			page={{
				name: 'Добавить группу пользователей',
				title: 'Добавить группу пользователей - Онлайн обучение',
			}}
			content={<GroupCreate />}
		/>
	);
};
