import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import CategoryDropDown from '../../components/CategoryDropDown';
import {
	fetchPostAction,
	updatePostAction,
} from '../../redux/slices/post/postsSlice';
import { Navigate, useParams } from 'react-router-dom';
import {
	EditorState,
	convertToRaw,
	ContentState,
	convertFromHTML,
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import embed from 'embed-video';

const formSchema = Yup.object({
	title: Yup.string().required('Title is required'),
	description: Yup.string().required('Description is required'),
	category: Yup.object().required('Category is required'),
});

const UpdatePost = (props) => {
	const { postId } = useParams();
	const dispatch = useDispatch();

	const { post, isUpdated, loading, serverErr, appErr } = useSelector(
		(state) => state.posts
	);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			title: post?.title,
			description: post?.description,
			category: { value: post?.category, label: post?.category },
		},

		onSubmit: (values) => {
			const data = {
				title: values?.title,
				description: values?.description,
				category: values?.category?.label,
				postId,
			};

			dispatch(updatePostAction(data));
		},

		validationSchema: formSchema,
	});

	const [description, setDescription] = useState(() =>
		EditorState.createWithContent(
			ContentState.createFromBlockArray(
				convertFromHTML(post?.description || '<p></p>')
			)
		)
	);
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
		dispatch(fetchPostAction(postId));
		setDescription(
			EditorState.createWithContent(
				ContentState.createFromBlockArray(
					convertFromHTML(post?.description || '<p></p>')
				)
			)
		);
	}, [postId, dispatch, post?.description]);

	if (isUpdated) {
		return <Navigate to={`/posts`} />;
	}

	return (
		<>
			<div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
						Are you sure you want to edit{' '}
						<span className="text-green-300">{post?.title}</span>
						{serverErr || appErr ? (
							<p className="text-red-500">
								{serverErr}-{appErr}
							</p>
						) : null}
					</h2>
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
									<input
										id="title"
										name="title"
										type="title"
										autoComplete="title"
										onBlur={formik.handleBlur('title')}
										value={formik.values.title}
										onChange={formik.handleChange('title')}
										className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
									/>
								</div>
								<div className="text-red-500">
									{formik.touched.title && formik.errors.title}
								</div>
							</div>
							<CategoryDropDown
								value={formik.values.category?.label}
								onChange={formik.setFieldValue}
								onBlur={formik.setFieldTouched}
								error={formik.errors.category}
								touched={formik.touched.category}
							/>
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
								loc
								<div className="text-red-500">
									{formik.touched.description && formik.errors.description}
								</div>
							</div>

							<div>
								<button
									type="submit"
									className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
										loading && 'cursor-wait'
									}`}
								>
									{loading ? 'Updating ...' : 'Update'}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default UpdatePost;
