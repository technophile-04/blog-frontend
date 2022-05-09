import * as Yup from 'yup';
import { useFormik } from 'formik';
import { createPostAction } from '../../redux/slices/post/postsSlice';
import { useDispatch } from 'react-redux';
import CategoryDropDown from '../../components/CategoryDropDown';
import DropZone from 'react-dropzone';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import embed from 'embed-video';

const formSchema = Yup.object({
	title: Yup.string().required('Title is required'),
	description: Yup.string().required('Description is required'),
	category: Yup.object().required('Category is required').nullable(),
	image: Yup.string().required('image  is required'),
});

const CreatePost = () => {
	const { isCreated, loading, serverErr, appErr } = useSelector(
		(state) => state.posts
	);

	const [imagePath, setImagePath] = useState([]);

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

	let editorState = EditorState.createEmpty();
	const [description, setDescription] = useState(editorState);
	const onEditorStateChange = (editorState) => {
		setDescription(editorState);
		const desc = draftToHtml(convertToRaw(editorState.getCurrentContent()));
		formik.setFieldValue('description', desc);
	};

	const handleEditorBlur = (e) => {
		formik.setFieldTouched('description', true);
	};

	function uploadImageCallBack(file) {
		return new Promise((resolve, reject) => {
			(async () => {
				try {
					const formData = new FormData();
					formData.append('file', file);
					formData.append(
						'upload_preset',
						process.env.REACT_APP_CLOUDINARY_PRESET
					);

					const res = await axios.post(
						`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
						formData
					);

					const imgObj = {
						data: {
							link: res.data.secure_url,
						},
					};

					resolve(imgObj);
				} catch (error) {
					console.log('from editor image', error.message);
					reject(error);
				}
			})();
		});
	}

	useEffect(() => {
		return () =>
			imagePath?.forEach((file) => URL.revokeObjectURL(file.preview));
	}, [imagePath]);

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
				<div className="mt-8 md:w-3/4 mx-auto">
					<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 w-full">
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
								<Editor
									editorState={description}
									toolbarClassName="toolbarClassName"
									wrapperClassName="wrapperClassName"
									editorClassName="border-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
									onEditorStateChange={onEditorStateChange}
									onBlur={handleEditorBlur}
									toolbar={{
										inline: { inDropdown: true },
										list: { inDropdown: true },
										textAlign: { inDropdown: true },
										link: { inDropdown: true },
										history: { inDropdown: true },
										image: {
											uploadCallback: uploadImageCallBack,
											alt: { present: true, mandatory: true },
											previewImage: true,
											defaultSize: { width: 500, height: 250 },
										},
										embedded: {
											embedCallback: (link) => {
												const detectedSrc = /<iframe.*? src="(.*?)"/.exec(
													embed(link)
												);
												return (detectedSrc && detectedSrc[1]) || link;
											},
										},
										blockType: {
											inDropdown: true,
											options: ['Normal', 'Blockquote', 'Code'],
										},
									}}
								/>
								<div className="text-red-500">
									{formik.touched.description && formik.errors.description}
								</div>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium mb-1 text-gray-700"
								>
									Cover Image
								</label>
								<div className="flex flex-1 flex-col items-center p-5 border-2 rounded-sm border-gray-400 border-dashed text-gray-400 transition-all duration-100 ease-in-out container">
									<DropZone
										onDrop={(acceptedFile) => {
											setImagePath(
												acceptedFile.map((file) =>
													Object.assign(file, {
														preview: URL.createObjectURL(file),
													})
												)
											);
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
							<div
								className="relative"
								style={{ maxWidth: '100px', maxHeight: '100px' }}
							>
								{imagePath[0]?.preview && (
									<button
										onClick={() => setImagePath([])}
										className="absolute z-10 top-0 right-0"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6 text-red-500 "
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={2}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								)}
								{imagePath[0]?.preview && (
									<img src={imagePath[0]?.preview} alt="uploadedImage" />
								)}
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
