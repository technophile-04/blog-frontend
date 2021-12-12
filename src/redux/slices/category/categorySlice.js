import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URLS } from '../../../utils/constants';

// Create category
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

// Fetch all categoris
export const fetchAllCategoriesAction = createAsyncThunk(
	'category/fetchCategories',
	async (payload, { rejectWithValue, getState }) => {
		try {
			const { users } = getState();
			console.log(users.userAuth.token);

			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${users.userAuth.token}`,
				},
			};

			console.log(config);

			const { data } = await axios.get(API_URLS.fetchAllCategories(), config);

			return data;
		} catch (error) {
			if (!error?.response) {
				throw error;
			}

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
		categoryList: undefined,
		serverErr: undefined,
	},
	extraReducers: (builder) => {
		// Create category
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

		// FetchAllcategory
		builder.addCase(fetchAllCategoriesAction.pending, (state, action) => {
			state.loading = true;
			state.appErr = undefined;
			state.serverErr = undefined;
		});

		builder.addCase(fetchAllCategoriesAction.fulfilled, (state, action) => {
			state.loading = false;
			state.category = action?.payload;
			state.appErr = undefined;
			state.serverErr = undefined;
			state.categoryList = action?.payload;
		});

		builder.addCase(fetchAllCategoriesAction.rejected, (state, action) => {
			state.loading = false;
			state.serverErr = action?.error?.message;
			state.appErr = action?.payload?.message;
		});
	},
});

export default categorySlice.reducer;
