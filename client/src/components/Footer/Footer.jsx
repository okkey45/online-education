import React from 'react';

export const Footer = () => {
	return (
		<footer className="footer__main fixed-footer">
			<div className="dev">
				Powered By{' '}
				<a
					href="https://ChalinClub.ru"
					target="_blank"
					rel="noopener noreferrer"
				>
					ChalinClub.ru
				</a>
			</div>
			<div className="footer__links">
				<a href="/" className="footer__link">
					Documentation
				</a>
				<a href="/" className="footer__link">
					Changelog
				</a>
			</div>
		</footer>
	);
};
