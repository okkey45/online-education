import React from 'react';

export const SubjectDetail = ({ subject }) => {
	return (
		<div className="widget__wrapper has-shadow">
			<div className="widget__header">
				<h4 className="widget__title">{subject.title}</h4>
			</div>
			<div className="widget__body">{subject.context}</div>
		</div>
	);
};
