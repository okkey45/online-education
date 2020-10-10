import React from 'react';

import { Form } from 'react-bootstrap';

export const ErrorMessage = ({ errors, fieldName }) => {
	const err = errors.filter((er) => er.param === fieldName).map((e) => e.msg);

	if (err.length) {
		return (
			<Form.Control.Feedback type="invalid" className="d-block">
				{err}
			</Form.Control.Feedback>
		);
	}
	return (
		<Form.Control.Feedback type="valid" className="d-block">
			Ok
		</Form.Control.Feedback>
	);
};
