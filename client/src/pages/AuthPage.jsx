import React from 'react';
import { Login } from '../components/Auth/Login';
import { Register } from '../components/Auth/Register';
import { RegisterWaitingConfirm } from '../components/Auth/RegisterWaitingConfirm';

export const AuthPage = ({ action }) => {
	return (
		<>
			{action === 'login' && <Login />}
			{action === 'register' && <Register />}
			{action === 'registerWaitingConfirm' && <RegisterWaitingConfirm />}
		</>
	);
};
