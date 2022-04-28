import { UploadIcon } from '@heroicons/react/outline';
import Dropzone from 'react-dropzone';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { uploadProfilePhotoAction } from '../../redux/slices/user/userSlice';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const formSchema = Yup.object({
	image: Yup.string().required('Image is required'),
});

const UploadProfilePhoto = () => {
	const dispatch = useDispatch();

	const { userAuth, loading, appErr, serverErr, isUpdated } = useSelector(
		(store) => store.users
	);

	const [imagePath, setImagePath] = useState([]);

	const formik = useFormik({
		initialValues: {
			image: '',
		},
		onSubmit: (values) => {
			dispatch(uploadProfilePhotoAction(values));
		},
		validationSchema: formSchema,
	});

	useEffect(() => {
		return () =>
			imagePath?.forEach((file) => URL.revokeObjectURL(file.preview));
	}, [imagePath]);

	if (isUpdated) {
		return <Navigate to={`/profile/${userAuth?._id}`} />;
	}

	return (
		<div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
					Upload profile photo
				</h2>
				{/* Displya err here */}
				{appErr || serverErr ? (
					<h2 className="text-center text-2xl text-red-500 font-bold mt-1 mb-0">
						{appErr} {serverErr}
					</h2>
				) : null}
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form className="space-y-6" onSubmit={formik.handleSubmit}>
						{/* Image container here thus Dropzone */}
						<div className="flex flex-1 flex-col items-center p-5 border-2 rounded-sm border-gray-400 border-dashed text-gray-400 transition-all duration-100 ease-in-out container">
							<Dropzone
								onBlur={formik.handleBlur('image')}
								accept="image/jpeg, image/png"
								onDrop={(acceptedFiles) => {
									setImagePath(
										acceptedFiles.map((file) =>
											Object.assign(file, {
												preview: URL.createObjectURL(file),
											})
										)
									);
									formik.setFieldValue('image', acceptedFiles[0]);
								}}
							>
								{({ getRootProps, getInputProps }) => (
									<div className="container">
										<div
											{...getRootProps({
												className: 'dropzone',
												onDrop: (event) => event.stopPropagation(),
											})}
										>
											<input {...getInputProps()} />
											<p className="text-gray-300 text-lg cursor-pointer hover:text-gray-500">
												Click here to select image
											</p>
										</div>
									</div>
								)}
							</Dropzone>
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
						<div className="text-red-500">
							{formik.touched.image && formik.errors.image}
						</div>
						<p className="text-sm text-gray-500">
							PNG, JPG, GIF minimum size 400kb uploaded only 1 image
						</p>

						<div>
							<button
								type="submit"
								className="inline-flex justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
								disabled={loading}
							>
								{loading ? (
									<>
										<svg
											class="animate-spin h-5 w-5 mr-3 ..."
											viewBox="0 0 24 24"
										></svg>
										<span>Updating...</span>
									</>
								) : (
									<>
										<UploadIcon
											className="-ml-1 mr-2 h-5  text-gray-400"
											aria-hidden="true"
										/>
										<span>Upload Photo</span>
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default UploadProfilePhoto;
