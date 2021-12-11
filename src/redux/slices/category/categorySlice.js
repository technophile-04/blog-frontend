import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URLS } from '../../../utils/constants';

export const createCategoryAction = createAsyncThunk(
	'category/create',
	async (category, { rejectWithValue, getState, dispatch }) => {
		try {
			const { users } = getState();
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${users.userAuth.token}`,
				},
			};
			const { data } = await axios.post(
				API_URLS.createCategory(),
				{
					title: category?.title,
				},
				config
			);
			toast.success(`Succefully created ${data.title} category!`);
			return data;
		} catch (error) {
			if (!error?.response) {
				throw error;
			}
			toast.error('Error creating category');
			return rejectWithValue(error.response?.data);
		}
	}
);

const categorySlice = createSlice({
	name: 'category',
	initialState: {
		category: null,
		loading: false,
		appErr: undefined,
		serverErr: undefined,
	},
	extraReducers: (builder) => {
		builder.addCase(createCategoryAction.pending, (state, action) => {
			state.loading = true;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(createCategoryAction.fulfilled, (state, action) => {
			state.loading = false;
			state.category = action?.payload;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(createCategoryAction.rejected, (state, action) => {
			state.loading = false;
			state.serverErr = action?.error?.message;
			state.appErr = action?.payload?.message;
		});
	},
});

export default categorySlice.reducer;
