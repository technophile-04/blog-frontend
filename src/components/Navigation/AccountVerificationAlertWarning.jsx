import { ExclamationIcon, CheckCircleIcon } from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import { sendVerficationTokenAction } from '../../redux/slices/accountVerification/accountVerficationSlice';

const AccountVerificationAlertWarning = () => {
	const { mailSent, loading } = useSelector(
		(store) => store.accountVerification
	);

	const { userAuth } = useSelector((store) => store.users);
	const dispatch = useDispatch();

	return (
		<div
			className={`${
				mailSent ? 'bg-green-200' : 'bg-red-500'
			}  border-l-4 border-yellow-400 p-1`}
		>
			<div className="flex">
				<div className="flex-shrink-0">
					{mailSent ? (
						<CheckCircleIcon
							className="h-5 w-5 text-green-600"
							aria-hidden="true"
						/>
					) : (
						<ExclamationIcon
							className="h-5 w-5 text-yellow-500"
							aria-hidden="true"
						/>
					)}
				</div>
				<div className="ml-3">
					<p className="text-sm text-yellow-200">
						{loading ? (
							'Sending mail...'
						) : mailSent ? (
							<p className="text-green-600 font-semibold">
								Please check your email {userAuth?.email} for verification
							</p>
						) : (
							<>
								Your account is not verified.{' '}
								<button
									className="font-medium underline text-green-200 hover:text-yellow-600"
									onClick={() => dispatch(sendVerficationTokenAction())}
								>
									Click this link to verify
								</button>
							</>
						)}
					</p>
				</div>
			</div>
		</div>
	);
};

export default AccountVerificationAlertWarning;
