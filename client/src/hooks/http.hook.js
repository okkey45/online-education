import { useState, useCallback } from 'react';

export const useHttp = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [errors, setErrors] = useState(null);

	const request = useCallback(
		async (url, method = 'GET', body = null, headers = {}) => {
			setLoading(true);

			try {
				if (body) {
					body = JSON.stringify(body);
					headers['Content-Type'] = 'application/json';
				}

				const response = await fetch(url, { method, body, headers });
				const data = await response.json();

				if (!response.ok) {
					if (data.errors.length > 0) {
						setErrors(data.errors);
					}
					throw new Error(data.message);
				}

				setLoading(false);

				return data;
			} catch (e) {
				setLoading(false);
				setError(e.message);
				throw e;
			}
		},
		[],
	);

	const clearError = useCallback(() => setError(null), []);
	const clearErrors = useCallback(() => setErrors(null), []);

	return { loading, request, error, clearError, errors, clearErrors };
};
