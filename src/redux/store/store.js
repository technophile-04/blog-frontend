import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../slices/user/userSlice';
import categoryReducer from '../slices/category/categorySlice';
import postReducer from '../slices/post/postsSlice';
const store = configureStore({
	reducer: {
		users: usersReducer,
		categories: categoryReducer,
		posts: postReducer,
	},
});

export default store;
