import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URLS } from '../../../utils';

export const sendMailAction = createAsyncThunk(
	'mail/send',
	async (mail, { rejectWithValue, getState, dispatch }) => {
		try {
			const { userAuth } = getState().users;
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userAuth.token}`,
				},
			};

			const res = await axios.post(
				API_URLS.sendEmail(),
				{
					to: mail.recipientEmail,
					message: mail.message,
					subject: mail.subject,
				},
				config
			);

			if (res.data.message) {
				toast.success(res.data.message);
			} else {
				toast.error(res.data);
			}
		} catch (error) {
			if (!error?.response) {
				throw error;
			}
			toast.error('Error sending the mail');
			return rejectWithValue(error.response?.data);
		}
	}
);

const mailSice = createSlice({
	name: 'mail',
	initialState: {
		appErr: undefined,
		serverErr: undefined,
		loading: false,
		mailSent: '',
	},
	extraReducers: (builder) => {
		builder.addCase(sendMailAction.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(sendMailAction.fulfilled, (state, action) => {
			state.loading = false;
			state.appErr = undefined;
			state.serverErr = undefined;
			state.mailSent = action?.payload;
		});
		builder.addCase(sendMailAction.rejected, (state, action) => {
			state.loading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
		});
	},
});

export default mailSice.reducer;
