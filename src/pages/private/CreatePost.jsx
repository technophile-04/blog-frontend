import * as Yup from 'yup';
import { useFormik } from 'formik';
import { createPostAction } from '../../redux/slices/post/postsSlice';
import { useDispatch } from 'react-redux';
import CategoryDropDown from '../../components/CategoryDropDown';
import DropZone from 'react-dropzone';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const formSchema = Yup.object({
	title: Yup.string().required('Title is required'),
	description: Yup.string().required('Description is required'),
	category: Yup.object().required('Category is required'),
	image: Yup.string().required('image  is required'),
});

const CreatePost = () => {
	const { isCreated, loading, serverErr, appErr } = useSelector(
		(state) => state.posts
	);
	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			title: '',
			description: '',
			category: '',
			image: '',
		},

		onSubmit: (values) => {
			const data = {
				category: values?.category?.label,
				title: values?.title,
				description: values?.description,
				image: values?.image,
			};
			console.log(data);
			dispatch(createPostAction(data));
		},

		validationSchema: formSchema,
	});

	if (isCreated) {
		return <Navigate to="/posts" />;
	}

	return (
		<>
			<div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
						Create Post
					</h2>

					<p className="mt-2 text-center text-sm text-gray-600">
						<p className="font-medium text-green-600 hover:text-indigo-500">
							Share your ideas to the word. Your post must be free from
							profanity
						</p>
					</p>

					{serverErr || appErr ? (
						<p className="mt-2 text-center text-sm text-gray-600">
							<p className="font-medium text-xl text-red-600">
								{`${serverErr} - ${appErr}`}
							</p>
						</p>
					) : null}
				</div>
				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
						<form className="space-y-6" onSubmit={formik.handleSubmit}>
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700"
								>
									Title
								</label>
								<div className="mt-1">
									{/* Title */}
									<input
										id="title"
										name="title"
										type="title"
										autoComplete="title"
										value={formik.values.title}
										onChange={formik.handleChange('title')}
										onBlur={formik.handleBlur('title')}
										className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
									/>
								</div>
								<div className="text-red-500">
									{formik.touched.title && formik.errors.title}
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Select Category
								</label>
								<CategoryDropDown
									value={formik.values?.category?.label}
									onChange={formik.setFieldValue}
									onBlur={formik.setFieldTouched}
									error={formik.errors.category}
									touched={formik.touched.category}
								/>
							</div>
							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700"
								>
									Description
								</label>
								{/* Description */}
								<textarea
									rows="5"
									cols="10"
									className="rounded-lg appearance-none block w-full py-3 px-3 text-base text-center leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none"
									value={formik.values.description}
									onChange={formik.handleChange('description')}
									onBlur={formik.handleBlur('description')}
									type="text"
								></textarea>
								{/* Err msg */}
								<div className="text-red-500">
									{formik.touched.description && formik.errors.description}
								</div>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium mb-1 text-gray-700"
								>
									Select an image
								</label>
								<div className="flex flex-1 flex-col items-center p-5 border-2 rounded-sm border-gray-400 border-dashed text-gray-400 transition-all duration-100 ease-in-out container">
									<DropZone
										onDrop={(acceptedFile) => {
											formik.setFieldValue('image', acceptedFile[0]);
										}}
										accept={'image/jpeg,image/png'}
										onBlur={formik.handleBlur('image')}
									>
										{({ getRootProps, getInputProps }) => {
											return (
												<div className="container">
													<div
														{...getRootProps({
															className: 'dropzone',
															onDrop: (event) => event.stopPropagation(),
														})}
													>
														<input {...getInputProps()} />
														<p className="text-lg text-gray-500 text-center cursor-pointer p-1">
															Click here to select image
														</p>
													</div>
													{/* Err msg */}
													<div className="text-red-500">
														{formik.touched.image && formik.errors.image}
													</div>
												</div>
											);
										}}
									</DropZone>
								</div>
							</div>
							<div>
								{/* Submit btn */}
								<button
									type="submit"
									className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
										loading && 'cursor-wait'
									}`}
								>
									Create
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default CreatePost;
