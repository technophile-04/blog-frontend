import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../slices/user/userSlice';
import categoryReducer from '../slices/category/categorySlice';
import postReducer from '../slices/post/postsSlice';
import commentsReducer from '../slices/comment/commentsSlice';
import mailReducer from '../slices/email/emailSlice';
const store = configureStore({
	reducer: {
		users: usersReducer,
		categories: categoryReducer,
		posts: postReducer,
		comments: commentsReducer,
		mails: mailReducer,
	},
});

export default store;
