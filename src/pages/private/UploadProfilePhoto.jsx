import { UploadIcon } from '@heroicons/react/outline';
import Dropzone from 'react-dropzone';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { uploadProfilePhotoAction } from '../../redux/slices/user/userSlice';

const formSchema = Yup.object({
	image: Yup.string().required('Image is required'),
});

export default function UploadProfilePhoto() {
	const dispatch = useDispatch();

	const { loading, appErr, serverErr } = useSelector((store) => store.users);

	const formik = useFormik({
		initialValues: {
			image: '',
		},
		onSubmit: (values) => {
			dispatch(uploadProfilePhotoAction(values));
			console.log(values);
		},
		validationSchema: formSchema,
	});

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
}
