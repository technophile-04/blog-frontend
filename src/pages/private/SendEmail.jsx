import { useFormik } from 'formik';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { sendMailAction } from '../../redux/slices/email/emailSlice';

const formSchema = Yup.object({
	recipientEmail: Yup.string().required('Recipent Email is required'),
	subject: Yup.string().required('Subject is required'),
	message: Yup.string().required('Message is required'),
});
const SendEmail = () => {
	const dispatch = useDispatch();

	const location = useLocation();

	const { loading, appErr, serverErr } = useSelector((store) => store.mails);

	const formik = useFormik({
		initialValues: {
			recipientEmail: location.state.email,
			subject: '',
			message: '',
		},
		onSubmit: (values) => {
			console.log(values);
			dispatch(sendMailAction(values));
		},
		validationSchema: formSchema,
	});
	return (
		<div className="fill-available bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
					Send Mesage
				</h2>

				{appErr || serverErr ? (
					<p className="mt-2 text-center text-lg font-semibold text-red-500">
						{serverErr} - {appErr}
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
								Recipient Email
							</label>
							{/* Email message */}
							<div className="mt-1">
								<input
									value={formik.values.recipientEmail}
									onChange={formik.handleChange('recipientEmail')}
									onBlur={formik.handleBlur('recipientEmail')}
									disabled
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									className="appearance-none block w-full px-3 py-2 border bg-gray-200 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								/>
							</div>
							{/* Err msg */}
							<div className="text-red-500">
								{formik.touched.recipientEmail && formik.errors.recipientEmail}
							</div>
						</div>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Subject
							</label>
							<div className="mt-1">
								{/* Subject */}
								<input
									value={formik.values.subject}
									onChange={formik.handleChange('subject')}
									onBlur={formik.handleBlur('subject')}
									id="subject"
									name="subject"
									type="text"
									autoComplete="subject"
									className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								/>
							</div>
							{/* err msg */}
							<div className="text-red-500">
								{formik.touched.subject && formik.errors.subject}
							</div>
						</div>
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Message
							</label>
							{/* email message */}
							<textarea
								value={formik.values.message}
								onChange={formik.handleChange('message')}
								onBlur={formik.handleBlur('message')}
								rows="5"
								cols="10"
								className="rounded-lg appearance-none block w-full py-3 px-3 text-base text-center leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none"
								type="text"
							></textarea>
							{/* err here */}
							<div className="text-red-500">
								{formik.touched.message && formik.errors.message}
							</div>
						</div>
						{/* Submit btn */}
						<div>
							<button
								type={loading ? 'button' : 'submit'}
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								disabled={loading}
							>
								{loading ? (
									<>
										<svg
											className="animate-spin h-5 w-5 mr-3 bg-white"
											viewBox="0 0 24 24"
										></svg>
										<span>Sending...</span>
									</>
								) : (
									'Send'
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SendEmail;
