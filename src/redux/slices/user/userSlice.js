import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_URLS } from '../../../utils';

export const registerUserAction = createAsyncThunk(
	'user/register',
	async (user, { rejectWithValue, getState, dispatch }) => {
		console.log('Inside action!');
		try {
			const config = {
				headers: {
					'content-type': 'application/json',
				},
			};

			const res = await axios.post(API_URLS.register(), user, config);
			console.log(res);

			return res.data;
		} catch (error) {
			if (!error?.response) {
				throw error;
			}
			console.log(error?.response);
			return rejectWithValue(error?.response?.data);
		}
	}
);

const userSlice = createSlice({
	name: 'user',
	initialState: {
		userAuth: 'login',
		loading: false,
		registerd: {},
		appErr: undefined,
		serverErr: undefined,
	},
	extraReducers: (builder) => {
		builder.addCase(registerUserAction.pending, (state, action) => {
			state.loading = true;
		});

		builder.addCase(registerUserAction.fulfilled, (state, action) => {
			state.registerd = action?.payload;
			state.loading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(registerUserAction.rejected, (state, action) => {
			console.log(action.payload);
			state.loading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
		});
	},
});

export default userSlice.reducer;
