import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URLS } from '../../../utils/constants';

export const createCommentAction = createAsyncThunk(
	'comment/create',
	async (postBody, { rejectWithValue, getState, dispatch }) => {
		try {
			const { userAuth } = getState().users;
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userAuth?.token}`,
				},
			};
			const { data } = await axios.post(
				API_URLS.createComment(),
				postBody,
				config
			);

			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}

			rejectWithValue(error.response?.data);
		}
	}
);

const commentSlice = createSlice({
	name: 'comment',
	initialState: {
		comment: undefined,
		commentList: undefined,
		appErr: null,
		serverErr: null,
		loading: false,
	},
	extraReducers: (builder) => {
		// Create comment
		builder.addCase(createCommentAction.pending, (state, action) => {
			state.appErr = null;
			state.serverErr = null;
			state.loading = true;
		});

		builder.addCase(createCommentAction.fulfilled, (state, action) => {
			state.comment = action?.payload;
			state.appErr = null;
			state.serverErr = null;
			state.loading = false;
		});

		builder.addCase(createCommentAction.rejected, (state, action) => {
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			state.loading = false;
		});
	},
});

export default commentSlice.reducer;
