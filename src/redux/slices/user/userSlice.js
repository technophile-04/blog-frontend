import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	API_URLS,
	getItemFromLocalStorage,
	LOCALSTORAGE_TOKEN_KEY,
	setItemInLocalStorage,
} from '../../../utils';

//Register
export const registerUserAction = createAsyncThunk(
	'user/register',
	async (user, { rejectWithValue, getState, dispatch }) => {
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
			console.log('Error response', error?.response);
			return rejectWithValue(error?.response?.data);
		}
	}
);

// Login
export const loginUserAction = createAsyncThunk(
	'user/login',
	async (userData, { rejectWithValue, getState, dispatch }) => {
		try {
			const config = {
				headers: {
					'content-type': 'application/json',
				},
			};

			const { data } = await axios.post(API_URLS.login(), userData, config);

			setItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY, data);

			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

// Get from localstorage
const userLoginFromLocalStorage = getItemFromLocalStorage(
	LOCALSTORAGE_TOKEN_KEY
);

const userSlice = createSlice({
	name: 'user',
	initialState: {
		userAuth: userLoginFromLocalStorage,
		loading: false,
		registerdUser: null,
		appErr: undefined,
		serverErr: undefined,
	},
	extraReducers: (builder) => {
		// REGISTER
		builder.addCase(registerUserAction.pending, (state, action) => {
			state.loading = true;
		});

		builder.addCase(registerUserAction.fulfilled, (state, action) => {
			state.registerdUser = action?.payload;
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

		// LOGIN
		builder.addCase(loginUserAction.pending, (state, action) => {
			state.loading = true;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(loginUserAction.fulfilled, (state, action) => {
			state.loading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
			state.userAuth = action?.payload;
		});

		builder.addCase(loginUserAction.rejected, (state, action) => {
			state.loading = false;
			state.serverErr = action?.error?.message;
			state.appErr = action?.payload?.message;
		});
	},
});

export default userSlice.reducer;
