import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
	HeartIcon,
	EmojiSadIcon,
	UploadIcon,
	UserIcon,
} from '@heroicons/react/outline';

import { MailIcon, EyeIcon } from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import {
	followUserAction,
	unFollowUserAction,
	userProfileAction,
} from '../../redux/slices/user/userSlice';
import DateFormatter from '../../components/DateFormatter';
import Loader from '../../components/Loader';
import { truncateString } from '../../utils';

const Profile = () => {
	const { userId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { profile, userAuth, loading, serverErr, appErr, followLoading } =
		useSelector((store) => store.users);
	useEffect(() => {
		dispatch(userProfileAction(userId));
	}, [userId, dispatch]);

	return (
		<>
			{loading ? (
				<Loader />
			) : appErr || serverErr ? (
				<h1 className="text-3xl text-red-500 text-center mt-6">
					{appErr} {serverErr}
				</h1>
			) : (
				<div className="h-screen flex overflow-hidden bg-gray-800 text-white">
					{/* Static sidebar for desktop */}

					<div className="flex flex-col min-w-0 flex-1 overflow-hidden">
						<div className="flex-1 relative z-0 flex overflow-hidden">
							<main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
								<article>
									{/* Profile header */}
									<div>
										<div>
											<img
												className="h-32 w-full object-cover lg:h-48"
												src={
													'https://images.unsplash.com/photo-1650841095095-a01cbda9b138?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2800&q=80'
												}
												alt={profile?.firstName}
											/>
										</div>
										<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
											<div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
												<div className="flex -mt-20">
													<img
														className="h-24 w-24 rounded-full  ring-4 ring-white sm:h-32 sm:w-32"
														src={profile?.profilePhoto}
														alt={profile?.firstName}
													/>
												</div>
												<div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
													<div className=" flex flex-col 2xl:block mt-10 min-w-0 flex-1">
														<h1 className="text-2xl font-bold text-white ">
															{profile?.firstName} {profile?.lastName}{' '}
															<span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
																{profile?.accountType}
															</span>{' '}
															{/* Display if verified or not */}
															{profile?.isAccountVerified ? (
																<span className="inline-flex ml-2 items-center px-3 py-0.5  rounded-lg text-sm font-medium bg-green-600 text-gray-300">
																	Account Verified
																</span>
															) : (
																<span className="inline-flex ml-2 items-center px-3 py-0.5  rounded-lg text-sm font-medium bg-red-600 text-gray-300">
																	Unverified Account
																</span>
															)}
														</h1>
														<p className="m-3 text-lg text-white">
															Date Joined :{' '}
															<DateFormatter date={profile?.createdAt} />
														</p>
														<p className="text-green-600 mt-2 mb-2 font-semibold">
															{profile?.posts?.length} posts{' '}
															{profile?.followers?.length} followers{' '}
															{profile?.following?.length} following
														</p>
														{/* Who view my profile */}
														<div className="flex items-center  mb-2">
															<EyeIcon className="h-5 w-5 text-indigo-400" />
															<div className="pl-2 text-indigo-400">
																{profile?.viewedBy?.length}{' '}
																<span className="text-indigo-400 cursor-pointer">
																	users viewed your profile
																</span>
															</div>
														</div>

														{/* is login user */}
														{/* Upload profile photo */}
														{userAuth && userAuth?._id === profile?._id ? (
															<Link
																to={`/upload-profile-photo`}
																className="inline-flex justify-center w-48 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
															>
																<UploadIcon
																	className="-ml-1 mr-2 h-5 w-5 text-gray-400"
																	aria-hidden="true"
																/>
																<span>Upload Photo</span>
															</Link>
														) : null}
													</div>

													<div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
														{/* // Hide follow button from the same */}
														{userAuth && userAuth?._id !== profile?._id ? (
															<div>
																{!profile?.followers?.includes(
																	userAuth?._id
																) ? (
																	<button
																		onClick={() =>
																			dispatch(followUserAction(userId))
																		}
																		type="button"
																		className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
																		disabled={followLoading}
																	>
																		<HeartIcon
																			className="-ml-1 mr-2 h-5 w-5 text-gray-400"
																			aria-hidden="true"
																		/>
																		<span>Follow </span>
																	</button>
																) : (
																	<button
																		onClick={() =>
																			dispatch(unFollowUserAction(userId))
																		}
																		className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
																	>
																		<EmojiSadIcon
																			className="-ml-1 mr-2 h-5 w-5 text-gray-400"
																			aria-hidden="true"
																		/>
																		<span>Unfollow</span>
																	</button>
																)}
															</div>
														) : null}

														{/* Update Profile */}

														<>
															{userAuth && userAuth?._id === profile?._id ? (
																<Link
																	to="/update-profile"
																	className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
																>
																	<UserIcon
																		className="-ml-1 mr-2 h-5 w-5 text-gray-400"
																		aria-hidden="true"
																	/>
																	<span>Update Profile</span>
																</Link>
															) : null}
														</>
														{/* Send Mail */}
														{userAuth?.isAdmin && (
															<button
																onClick={() =>
																	navigate('/send-email', {
																		state: { email: profile?.email },
																	})
																}
																className="inline-flex justify-center bg-indigo-900 px-4 py-2 border border-yellow-700 shadow-sm text-sm font-medium rounded-md text-gray-700  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
															>
																<MailIcon
																	className="-ml-1 mr-2 h-5 w-5 text-gray-200"
																	aria-hidden="true"
																/>
																<span className="text-base mr-2  text-bold text-yellow-500">
																	Send Message
																</span>
															</button>
														)}
													</div>
												</div>
											</div>
											<div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
												<h1 className="text-2xl font-bold text-white truncate">
													{profile?.firstName} {profile?.lastName}
												</h1>
											</div>
										</div>
									</div>
									{/* Tabs */}
									<div className="mt-6 sm:mt-2 2xl:mt-5">
										<div className="border-b border-red-900">
											<div className="max-w-5xl mx-auto "></div>
										</div>
									</div>
									<div className="flex justify-center place-items-start flex-wrap  md:mb-0">
										{userAuth && userAuth?._id === profile?._id ? (
											<div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
												<h1 className="text-center text-xl border-gray-500 mb-2 border-b-2">
													Who viewed my profile : {profile?.viewedBy?.length}
												</h1>
												<ul className="">
													{profile?.viewedBy?.length === 0 ? (
														<p>No viewers</p>
													) : (
														profile?.viewedBy?.map((viewer) => (
															<Link to={`/profile/${viewer?._id}`}>
																<div className="flex mb-2 items-center space-x-4 lg:space-x-6">
																	<img
																		className="w-16 h-16 rounded-full lg:w-20 lg:h-20"
																		src={viewer.profilePhoto}
																		alt={'user name'}
																	/>
																	<div className="font-medium text-lg leading-6 space-y-1">
																		<h3>
																			{viewer?.firstName} {viewer?.lastName}
																		</h3>
																		<p className="text-indigo-600">
																			{viewer.accountType}
																		</p>
																	</div>
																</div>
															</Link>
														))
													)}
												</ul>
											</div>
										) : null}
										{/* All my Post */}
										<div className="w-full md:w-2/3 px-4 mb-4 md:mb-0">
											<h1 className="text-center text-xl border-gray-500 mb-2 border-b-2">
												My Post - {profile?.postCount}
											</h1>
											{profile?.postCount <= 0 ? (
												<h1 className="text-xl text-red-400 text-center">
													No posts found
												</h1>
											) : (
												profile?.posts?.map((post, index) => (
													<div
														className="flex flex-wrap  -mx-3 mt-3  lg:mb-6"
														key={post._id}
													>
														<div className="mb-2   w-full lg:w-1/4 px-3">
															<Link to={`/posts/${post._id}`}>
																<img
																	className="object-cover h-40 rounded"
																	src={post?.image}
																	alt="poster"
																/>
															</Link>
														</div>
														<div className="w-full lg:w-3/4 px-3">
															<Link
																to={`/posts/${post._id}`}
																className="hover:underline"
															>
																<h3 className="mb-1 text-2xl text-green-600 font-bold font-heading">
																	{post?.title.toUpperCase()}
																</h3>
															</Link>
															<p className="text-gray-200">
																{truncateString(post?.description, 100)}
															</p>
															<Link
																className="text-indigo-500 hover:underline"
																to={`/posts/${post._id}`}
															>
																Read more
															</Link>
														</div>
													</div>
												))
											)}
										</div>
									</div>
								</article>
							</main>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Profile;
