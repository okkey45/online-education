import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import logo from '../../img/logo.png';

export const RegisterWaitingConfirm = () => {
	const history = useHistory();

	return (
		<Container fluid className="auth__page">
			<Row>
				<Col md={5} lg={6} xl={8} className="col-left">
					<div className="title__wrapper">
						<h1 className="title">Welcome To Education Online!</h1>
						<span className="subtitle">
							Etiam consequat urna at magna bibendum, in tempor arcu fermentum
							vitae mi massa egestas.
						</span>
					</div>
				</Col>
				<Col md={7} lg={6} xl={4} className="col-right">
					<div className="auth-form__wrapper">
						<img
							className="logo"
							src={logo}
							alt="logo"
							width="140"
							height="127"
						/>
						<span className="h3 auth__title text-center">
							We are waiting for confirmation email
						</span>
						<p>
							На email{' '}
							<strong className="text-nowrap">
								{history.location.state.email}
							</strong>{' '}
							отправлено сообщение. Для завершения регистрации перейдите по
							ссылке в письме.
						</p>
						<p className="text-center">Ссылка действительна 30 минут.</p>
					</div>
				</Col>
			</Row>
		</Container>
	);
};
