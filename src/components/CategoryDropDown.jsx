import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchAllCategoriesAction } from '../redux/slices/category/categorySlice';

const CategoryDropDown = (props) => {
	const { categoryList, loading } = useSelector((store) => store?.categories);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchAllCategoriesAction());
	}, [dispatch]);

	const allCategories = categoryList?.map((category) => {
		return { value: category?._id, label: category.title };
	});

	const handleChange = (value) => {
		props.onChange('category', value);
	};

	const handleBlur = () => {
		props.onBlur('category', true);
	};

	return (
		<>
			<Select
				options={allCategories}
				isClearable
				onChange={handleChange}
				onBlur={handleBlur}
				value={props?.value?.label}
				isLoading={loading}
				isDisabled={loading}
				styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
			/>
			<div className="text-red-500">{props?.touched && props?.error}</div>
		</>
	);
};

export default CategoryDropDown;
