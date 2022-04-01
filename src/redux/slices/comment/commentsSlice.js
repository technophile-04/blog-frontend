import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URLS } from '../../../utils/constants';

// Create comment action
export const createCommentAction = createAsyncThunk(
	'comment/create',
	async (commentBody, { rejectWithValue, getState, dispatch }) => {
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
				commentBody,
				config
			);
			console.log(data);
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

// delete comment action
export const deleteCommentAction = createAsyncThunk(
	'comment/delete',
	async (commentId, { rejectWithValue, getState, dispatch }) => {
		try {
			const { userAuth } = getState().users;
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userAuth?.token}`,
				},
			};

			const { data } = await axios.delete(
				API_URLS.deleteComment(commentId),
				config
			);
			toast.success('Comment deleted successfully');
			return data;
		} catch (error) {
			if (!error.response) throw error;
			toast.error(`Error in  deleting the comment`);
			return rejectWithValue(error.response?.data);
		}
	}
);

// update comment action
export const updateCommentAction = createAsyncThunk(
	'comment/update',
	async (
		{ description, commentId },
		{ rejectWithValue, getState, dispatch }
	) => {
		try {
			const { userAuth } = getState().users;
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userAuth?.token}`,
				},
			};

			const { data } = await axios.put(
				API_URLS.updateComment(commentId),
				{ description },
				config
			);
			toast.success('Comment updated successfully');
			return data;
		} catch (error) {
			if (!error.response) throw error;
			toast.error(error.response?.data?.message);
			return rejectWithValue(error.response?.data);
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
		deletedComment: null,
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

		// delete comment
		builder.addCase(deleteCommentAction.pending, (state, action) => {
			state.appErr = null;
			state.serverErr = null;
			state.loading = true;
		});

		builder.addCase(deleteCommentAction.fulfilled, (state, action) => {
			state.deletedComment = action?.payload;
			state.appErr = null;
			state.serverErr = null;
			state.loading = false;
		});

		builder.addCase(deleteCommentAction.rejected, (state, action) => {
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			state.loading = false;
		});

		// update comment action
		builder.addCase(updateCommentAction.pending, (state, action) => {
			state.appErr = null;
			state.serverErr = null;
			state.loading = true;
		});

		builder.addCase(updateCommentAction.fulfilled, (state, action) => {
			state.comment = action?.payload;
			state.appErr = null;
			state.serverErr = null;
			state.loading = false;
		});

		builder.addCase(updateCommentAction.rejected, (state, action) => {
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			state.loading = false;
		});
	},
});

export default commentSlice.reducer;
