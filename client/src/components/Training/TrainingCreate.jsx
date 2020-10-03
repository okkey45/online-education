import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { TextEditorWysiwyg } from '../TextEditor/TextEditorWysiwyg';

import { Col, Form, Button } from 'react-bootstrap';

export const TrainingCreate = () => {
	const history = useHistory();
	const auth = useContext(AuthContext);
	const { loading, request } = useHttp();
	const [form, setForm] = useState({
		title: '',
		description: '',
		detail_text: '',
	});

	const changeHandler = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value });
	};

	const saveHandler = async (event) => {
		try {
			const data = await request(
				'/api/training/create',
				'POST',
				{ ...form },
				{ Authorization: `Bearer ${auth.token}` },
			);
			history.push(`/training/${data.training._id}`);
		} catch (e) {}
	};

	return (
		<Col>
			<div className="widget__wrapper has-shadow">
				<div className="widget__body">
					<Form className="form__createTraining">
						<Form.Group controlId="inputTitle" className="mb-3">
							<Form.Label>Название тренинга</Form.Label>
							<Form.Control
								type="text"
								name="title"
								value={form.title}
								onChange={changeHandler}
							/>
						</Form.Group>
						<Form.Group controlId="inputDescription" className="mb-3">
							<Form.Label>Краткое описание тренинга</Form.Label>
							<Form.Control
								type="text"
								name="description"
								value={form.description}
								onChange={changeHandler}
							/>
						</Form.Group>
						<Form.Group controlId="inputDetailText" className="mb-3">
							<Form.Label>Описание тренинга</Form.Label>
							<Form.Control
								as="textarea"
								name="detail_text"
								value={form.detail_text}
								onChange={changeHandler}
							/>
						</Form.Group>
						<Button
							className="btn btn-primary btn__gradient btn__grad-danger btn__sign-in"
							type="submit"
							onClick={saveHandler}
							disabled={loading}
						>
							Сохранить тренинг
						</Button>
					</Form>
					{/* <TextEditorWysiwyg /> */}
				</div>
			</div>
		</Col>
	);
};
