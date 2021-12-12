const API_ROOT = 'http://localhost:8080/api';

export const API_URLS = {
	register: () => `${API_ROOT}/users/register`,
	login: () => `${API_ROOT}/users/login`,
	createCategory: () => `${API_ROOT}/categories`,
	fetchAllCategories: () => `${API_ROOT}/categories`,
};
