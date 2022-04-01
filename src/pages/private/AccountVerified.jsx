import React, { useEffect } from 'react';
import { CheckIcon, XCircleIcon } from '@heroicons/react/outline';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { verifyTokenAction } from '../../redux/slices/accountVerification/accountVerficationSlice';
import Loader from '../../components/Loader';
import { logoutUserAction } from '../../redux/slices/user/userSlice';

const AccountVerified = () => {
	const { tokenId } = useParams();
	const { loading, isVerified } = useSelector(
		(store) => store.accountVerification
	);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(verifyTokenAction(tokenId));
	}, [dispatch, tokenId]);

	return (
		<>
			{loading ? (
				<Loader />
			) : isVerified ? (
				<div className="flex justify-center items-center min-h-screen bg-gray-400">
					<div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
						<div>
							<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
								<CheckIcon
									className="h-6 w-6 text-green-600"
									aria-hidden="true"
								/>
							</div>
							<div className="mt-3 text-center sm:mt-5">
								<div
									as="h3"
									className="text-lg leading-6 font-medium text-gray-900"
								>
									Account Verified
								</div>
								<div className="mt-2">
									<p className="text-sm text-gray-500">
										Your account is now verified. Logout and login back to see
										the changes
									</p>
								</div>
							</div>
						</div>
						<div className="mt-5 sm:mt-6">
							<button
								type="button"
								onClick={() => dispatch(logoutUserAction())}
								className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			) : (
				<div className="flex justify-center items-center min-h-screen bg-gray-400">
					<div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
						<div>
							<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
								<XCircleIcon
									className="h-6 w-6 text-red-600"
									aria-hidden="true"
								/>
							</div>
							<div className="mt-3 text-center sm:mt-5">
								<div
									as="h3"
									className="text-lg leading-6 font-medium text-gray-900"
								>
									Verification Failed
								</div>
								<div className="mt-2">
									<p className="text-sm text-gray-500">
										Unable to verify account please try again,
										<br />
										Make sure you verify within 10 minutes
									</p>
								</div>
							</div>
						</div>
						<div className="mt-5 sm:mt-6">
							<Link
								to="/"
								className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
							>
								Home
							</Link>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default AccountVerified;
