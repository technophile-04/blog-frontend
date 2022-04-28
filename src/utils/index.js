export * from './constants';

export const setItemInLocalStorage = (key, value) => {
	if (!key || !value) {
		console.error('Key or value is missing cannot set to local storage');
	}

	const valueToStore =
		typeof value !== 'string' ? JSON.stringify(value) : value;

	localStorage.setItem(key, valueToStore);
};

export const getItemFromLocalStorage = (key) => {
	if (!key) {
		console.error('Key  missing cannot get!');
		return null;
	}

	return JSON.parse(localStorage.getItem(key));
};

export const removeItemFromLocalStorage = (key) => {
	if (!key) {
		console.error('Key  missing cannot get!');
		return;
	}

	localStorage.removeItem(key);
};

export const truncateString = (str, num) => {
	if (str.length > num) {
		return str.slice(0, num) + '...';
	} else {
		return str;
	}
};

export const LOCALSTORAGE_TOKEN_KEY = '__amigosBlog__';
