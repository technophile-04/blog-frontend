import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	API_URLS,
	getItemFromLocalStorage,
	LOCALSTORAGE_TOKEN_KEY,
	removeItemFromLocalStorage,
	setItemInLocalStorage,
} from '../../../utils';
import toast from 'react-hot-toast';

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
			toast.success(`Successfully Logged in,Welcome ${data.firstName}!`);

			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			toast.error('Error logging in');
			return rejectWithValue(error?.response?.data);
		}
	}
);

// Logout action
export const logoutUserAction = createAsyncThunk(
	'user/logout',
	async (data, { rejectWithValue, getState, dispatch }) => {
		try {
			removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
			toast.success('Successfully Logged out!');
			return null;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			toast.error('Error Logging out!');
			return rejectWithValue(error?.response?.data);
		}
	}
);

// Fetch other or owns user profile
export const userProfileAction = createAsyncThunk(
	'user/profile',
	async (id, { rejectWithValue, getState, dispatch }) => {
		try {
			const { userAuth } = getState().users;
			console.log(userAuth.token);
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userAuth.token}`,
				},
			};

			const { data } = await axios.get(API_URLS.fetchProfile(id), config);

			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			toast.error('Erro in findig user profile!');
			return rejectWithValue(error?.response?.data);
		}
	}
);

// Upload profile profilePhoto
export const uploadProfilePhotoAction = createAsyncThunk(
	'user/profile-Photo',
	async (profileImage, { rejectWithValue, getState, dispatch }) => {
		try {
			console.log('inside create post action');
			const { userAuth } = getState().users;
			const { image } = profileImage;

			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userAuth.token}`,
				},
			};

			const formData = new FormData();
			formData.append('image', image);

			const { data } = await axios.put(
				API_URLS.updateProfilePhoto(),
				formData,
				config
			);
			toast.success('Successfully updated profile photo!');
			// dispatch(resetPostAction());
			return data;
		} catch (error) {
			if (!error.response) {
				throw error;
			}
			toast.error('Error updating profile photo!');
			return rejectWithValue(error.response?.data);
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
		profile: undefined,
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

		// LOGOUT
		builder.addCase(logoutUserAction.pending, (state, action) => {
			state.loading = true;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(logoutUserAction.fulfilled, (state, action) => {
			state.loading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
			state.userAuth = action?.payload;
		});

		builder.addCase(logoutUserAction.rejected, (state, action) => {
			state.loading = false;
			state.serverErr = action?.error?.message;
			state.appErr = action?.payload?.message;
		});

		// profile
		builder.addCase(userProfileAction.pending, (state, action) => {
			state.loading = true;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(userProfileAction.fulfilled, (state, action) => {
			state.loading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
			state.profile = action?.payload;
		});

		builder.addCase(userProfileAction.rejected, (state, action) => {
			state.loading = false;
			state.serverErr = action?.error?.message;
			state.appErr = action?.payload?.message;
		});

		// Update profile photo
		builder.addCase(uploadProfilePhotoAction.pending, (state, action) => {
			state.loading = true;
		});

		builder.addCase(uploadProfilePhotoAction.fulfilled, (state, action) => {
			state.userAuth = action?.payload;
			state.profile = action?.payload;
			state.loading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(uploadProfilePhotoAction.rejected, (state, action) => {
			console.log(action.payload);
			state.loading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
		});
	},
});

export default userSlice.reducer;
