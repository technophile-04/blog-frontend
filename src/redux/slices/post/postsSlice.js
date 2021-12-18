import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_URLS } from '../../../utils/constants';
import axios from 'axios';

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

			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}

			return rejectWithValue(error?.response?.data);
		}
	}
);

const postSlice = createSlice({
	name: 'post',
	initialState: {
		post: undefined,
		loading: false,
		appErr: undefined,
		serverErr: undefined,
	},
	extraReducers: (builder) => {
		builder.addCase(createPostAction.pending, (state, action) => {
			state.loading = true;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(createPostAction.fulfilled, (state, action) => {
			state.loading = false;
			console.log(action?.payload);
			state.post = action?.payload;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(createPostAction.rejected, (state, action) => {
			state.loading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
		});
	},
});

export default postSlice.reducer;
