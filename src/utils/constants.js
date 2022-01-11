const API_ROOT = 'http://localhost:8080/api';

export const API_URLS = {
	register: () => `${API_ROOT}/users/register`,
	login: () => `${API_ROOT}/users/login`,
	createCategory: () => `${API_ROOT}/categories`,
	fetchAllCategories: () => `${API_ROOT}/categories`,
	updateCategory: (id) => `${API_ROOT}/categories/${id}`,
	deleteCategory: (id) => `${API_ROOT}/categories/${id}`,
	fetchCategory: (id) => `${API_ROOT}/categories/${id}`,
	createPost: () => `${API_ROOT}/posts`,
	fetchAllPosts: (category) => `${API_ROOT}/posts?category=${category}`,
	toggleLike: () => `${API_ROOT}/posts/likes`,
	toggleDislike: () => `${API_ROOT}/posts/dislikes`,
	fetchPost: (postId) => `${API_ROOT}/posts/${postId}`,
	updatePost: (postId) => `${API_ROOT}/posts/${postId}`,
	deletePost: (postId) => `${API_ROOT}/posts/${postId}`,
	createComment: () => `${API_ROOT}/comments`,
	deleteComment: (commentId) => `${API_ROOT}/comments/${commentId}`,
	updateComment: (commentId) => `${API_ROOT}/comments/${commentId}`,
};
