import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URLS } from '../../../utils';

// Send verification token via mail
export const sendVerficationTokenAction = createAsyncThunk(
	'verificationToken/send',
	async (email, { rejectWithValue, getState, dispatch }) => {
		try {
			const { userAuth } = getState().users;
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userAuth.token}`,
				},
			};

			const res = await axios.post(
				API_URLS.sendVerificationToken(),
				{},
				config
			);

			toast.success(res.data);

			return res.data;
		} catch (error) {
			if (!error?.response) {
				throw error;
			}
			toast.error('Error sending the mail');
			return rejectWithValue(error.response?.data);
		}
	}
);

export const verifyTokenAction = createAsyncThunk(
	'verificationToken/verify',
	async (tokenId, { rejectWithValue, getState, dispatch }) => {
		try {
			const { userAuth } = getState().users;
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userAuth.token}`,
				},
			};

			const res = await axios.put(
				API_URLS.verfifyToken(),
				{
					verificationToken: tokenId,
				},
				config
			);

			toast.success(res.data);

			return res.data;
		} catch (error) {
			if (!error?.response) {
				throw error;
			}
			toast.error(error.response?.data?.message);
			return rejectWithValue(error.response?.data);
		}
	}
);

const accountVerificationSlice = createSlice({
	name: 'verificationToken',
	initialState: {
		appErr: undefined,
		serverErr: undefined,
		loading: false,
		mailSent: '',
		isVerified: false,
		verified: false,
	},
	extraReducers: (builder) => {
		// Handling sending verification token
		builder.addCase(sendVerficationTokenAction.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(sendVerficationTokenAction.fulfilled, (state, action) => {
			state.loading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
			state.mailSent = action?.payload;
		});
		builder.addCase(sendVerficationTokenAction.rejected, (state, action) => {
			state.loading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
		});

		// Verified user
		builder.addCase(verifyTokenAction.pending, (state, action) => {
			state.loading = true;
		});

		builder.addCase(verifyTokenAction.fulfilled, (state, action) => {
			state.loading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
			state.mailSent = action?.payload;
			state.verified = false;
			state.isVerified = true;
		});
		builder.addCase(verifyTokenAction.rejected, (state, action) => {
			state.loading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			state.isVerified = false;
		});
	},
});

export default accountVerificationSlice.reducer;
