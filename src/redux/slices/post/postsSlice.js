import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_URLS } from '../../../utils/constants';
import axios from 'axios';
import toast from 'react-hot-toast';

// reset post action
export const resetPostAction = createAction('post/reset');
export const resetUpdatePostAction = createAction('post/resetUpdate');
export const resetDeletePostAction = createAction('post/resetDelete');

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
			toast.error(error.response?.data?.message);
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
					Authorization: `Bearer ${userAuth?.token}`,
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
					Authorization: `Bearer ${userAuth?.token}`,
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

// Updata a post action
export const updatePostAction = createAsyncThunk(
	'posts/updatePost',
	async ({ postId, ...body }, { rejectWithValue, getState, dispatch }) => {
		try {
			const { userAuth } = getState().users;

			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userAuth.token}`,
				},
			};

			const { data } = axios.put(API_URLS.updatePost(postId), body, config);
			dispatch(resetUpdatePostAction());
			toast.success(`Succefully updated the post!`);
			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			toast.error(`Error in  updating the post!`);
			return rejectWithValue(error.response?.data);
		}
	}
);

export const deletePostAction = createAsyncThunk(
	'posts/delete',
	async (postId, { rejectWithValue, getState, dispatch }) => {
		try {
			const { userAuth } = getState().users;

			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userAuth.token}`,
				},
			};
			const { data } = axios.delete(API_URLS.deletePost(postId), config);
			console.log(data);
			toast.success('Post deleted successfully !');
			dispatch(resetDeletePostAction());
			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			toast.error(`Error in  deleting the post!`);
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
		isUpdated: false,
		isDeleted: false,
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

		// Update a POST
		builder.addCase(updatePostAction.pending, (state, action) => {
			state.loading = true;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(resetUpdatePostAction, (state, action) => {
			state.isUpdated = true;
		});

		builder.addCase(updatePostAction.fulfilled, (state, action) => {
			state.loading = false;
			state.post = action?.payload;
			state.appErr = undefined;
			state.serverErr = undefined;
			state.isUpdated = false;
		});

		builder.addCase(updatePostAction.rejected, (state, action) => {
			state.loading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			state.isUpdated = false;
		});

		// Delete a POST
		builder.addCase(deletePostAction.pending, (state, action) => {
			state.loading = true;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(resetDeletePostAction, (state, action) => {
			state.isDeleted = true;
		});

		builder.addCase(deletePostAction.fulfilled, (state, action) => {
			state.loading = false;
			state.post = action?.payload;
			state.appErr = undefined;
			state.serverErr = undefined;
			state.isDeleted = false;
		});

		builder.addCase(deletePostAction.rejected, (state, action) => {
			state.loading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			state.isDeleted = false;
		});
	},
});

export default postSlice.reducer;
