import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_URLS } from '../../../utils/constants';
import axios from 'axios';
import toast from 'react-hot-toast';

// reset post action
export const resetPostAction = createAction('post/reset');

// Create post action
export const createPostAction = createAsyncThunk(
	'post/create',
	async (postData, { rejectWithValue, getState, dispatch }) => {
		try {
			console.log('inside create post action');
			const { userAuth } = getState().users;
			const { title, description, category, image } = postData;

			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userAuth.token}`,
				},
			};

			const formData = new FormData();
			formData.append('title', title);
			formData.append('description', description);
			formData.append('category', category);
			formData.append('image', image);

			const { data } = await axios.post(
				API_URLS.createPost(),
				formData,
				config
			);
			toast.success('Successfully created post !');
			dispatch(resetPostAction());
			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			toast.error('Error creating post');
			return rejectWithValue(error.response?.data);
		}
	}
);

// Fetch all post action
export const fetchAllPostsAction = createAsyncThunk(
	'posts/fetchAll',
	async (category, { rejectWithValue, getState, dispatch }) => {
		try {
			const { data } = await axios.get(API_URLS.fetchAllPosts(category));

			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}

			return rejectWithValue(error.response?.data);
		}
	}
);

// Toggle likes action
export const toggleLikeToPostAction = createAsyncThunk(
	'posts/toggleLike',
	async (postId, { rejectWithValue, getState, dispatch }) => {
		try {
			const { userAuth } = getState().users;

			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userAuth.token}`,
				},
			};

			const { data } = await axios.put(
				API_URLS.toggleLike(),
				{ postId },
				config
			);

			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error.response?.data);
		}
	}
);

// Toggle dislike action
export const toggleDislikesAction = createAsyncThunk(
	'posts/toggleDislike',
	async (postId, { rejectWithValue, getState, dispatch }) => {
		try {
			const { userAuth } = getState().users;

			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userAuth.token}`,
				},
			};

			const { data } = await axios.put(
				API_URLS.toggleDislike(),
				{ postId },
				config
			);

			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}

			return rejectWithValue(error.response?.data);
		}
	}
);

// Fetch a post action
export const fetchPostAction = createAsyncThunk(
	'posts/fetchPost',
	async (postId, { rejectWithValue, getState, dispatch }) => {
		try {
			const { data } = await axios.get(API_URLS.fetchPost(postId));
			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}

			return rejectWithValue(error.response?.data);
		}
	}
);

const postSlice = createSlice({
	name: 'post',
	initialState: {
		post: undefined,
		allPosts: undefined,
		loading: false,
		appErr: undefined,
		serverErr: undefined,
		isCreated: false,
		likedPost: undefined,
		disLikedPost: undefined,
	},
	extraReducers: (builder) => {
		// CREATE POST
		builder.addCase(createPostAction.pending, (state, action) => {
			state.loading = true;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(resetPostAction, (state, action) => {
			state.isCreated = true;
		});

		builder.addCase(createPostAction.fulfilled, (state, action) => {
			state.loading = false;
			state.post = action?.payload;
			state.appErr = undefined;
			state.isCreated = false;
			state.serverErr = undefined;
		});

		builder.addCase(createPostAction.rejected, (state, action) => {
			state.loading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
		});

		// FETCH ALL POSTS
		builder.addCase(fetchAllPostsAction.pending, (state, action) => {
			state.loading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
		});
		builder.addCase(fetchAllPostsAction.fulfilled, (state, action) => {
			state.allPosts = action?.payload;
			state.loading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
		});
		builder.addCase(fetchAllPostsAction.rejected, (state, action) => {
			state.loading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
		});

		// Toogle like
		builder.addCase(toggleLikeToPostAction.pending, (state, action) => {
			state.loading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(toggleLikeToPostAction.fulfilled, (state, action) => {
			state.likedPost = action?.payload;
			state.loading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(toggleLikeToPostAction.rejected, (state, action) => {
			state.loading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
		});

		// Toggle Dislike
		builder.addCase(toggleDislikesAction.pending, (state, action) => {
			state.loading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(toggleDislikesAction.fulfilled, (state, action) => {
			state.disLikedPost = action?.payload;
			state.loading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(toggleDislikesAction.rejected, (state, action) => {
			state.loading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
		});

		// Fetch a POST
		builder.addCase(fetchPostAction.pending, (state, action) => {
			state.loading = true;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(fetchPostAction.fulfilled, (state, action) => {
			state.loading = false;
			state.post = action?.payload;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(fetchPostAction.rejected, (state, action) => {
			state.loading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
		});
	},
});

export default postSlice.reducer;
