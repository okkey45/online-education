import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';

import { Col, Form, Button } from 'react-bootstrap';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export const SubjectCreate = () => {
	const history = useHistory();
	const auth = useContext(AuthContext);
	const { request, loading } = useHttp();
	const [form, setForm] = useState({
		title: '',
		sorting: '',
	});
	const [editorState, setEditorState] = useState(() => {
		EditorState.createEmpty();
	});
	const { trainingId, trainingTitle } = history.location.state;

	const changeHandler = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value });
	};

	const onEditorStateChange = (editorState) => {
		setEditorState(editorState);
	};

	const saveHandler = async (event) => {
		const detailText = draftToHtml(
			convertToRaw(editorState.getCurrentContent()),
		);

		try {
			const data = await request(
				'/api/subject/create',
				'POST',
				{ ...form, context: detailText, training_id: trainingId },
				{ Authorization: `Bearer ${auth.token}` },
			);
			if (data) history.push(`/training/${trainingId}`);
		} catch (e) {}
	};

	return (
		<Col>
			<div className="widget__wrapper has-shadow">
				<div className="widget__header">
					<h4 className="widget__title">
						Тема занятия для тренинга «{trainingTitle}»
					</h4>
				</div>
				<div className="widget__body">
					<Form className="form__createTraining">
						<Form.Group controlId="inputTitle" className="mb-3">
							<Form.Label>Название темы</Form.Label>
							<Form.Control
								type="text"
								name="title"
								value={form.title}
								onChange={changeHandler}
							/>
						</Form.Group>
						<Form.Group controlId="inputSorting" className="mb-3">
							<Form.Label>Сортировка</Form.Label>
							<Form.Control
								type="text"
								name="sorting"
								value={form.sorting}
								onChange={changeHandler}
							/>
						</Form.Group>
						<Editor
							editorState={editorState}
							wrapperClassName="text-editor__wrapper"
							toolbarClassName="text-editor____toolbar"
							editorClassName="text-editor__editor"
							onEditorStateChange={onEditorStateChange}
						/>
						<div className="btn__group">
							<Button
								className="btn btn-primary btn__gradient btn__grad-danger"
								type="submit"
								onClick={saveHandler}
								disabled={loading}
							>
								Сохранить
							</Button>
							<Button
								variant="secondary"
								type="button"
								onClick={history.goBack}
							>
								Отменить
							</Button>
						</div>
					</Form>
				</div>
			</div>
		</Col>
	);
};
