import { ThumbUpIcon, ThumbDownIcon, EyeIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
	fetchAllPostsAction,
	toggleDislikesAction,
	toggleLikeToPostAction,
} from '../../redux/slices/post/postsSlice';
import DateFormatter from '../../components/DateFormatter';
import { fetchAllCategoriesAction } from '../../redux/slices/category/categorySlice';
import { HashLoader } from 'react-spinners';
import { css } from '@emotion/react';

const override = css`
	display: block;
	margin: 2rem auto;
`;

const PostList = () => {
	const dispatch = useDispatch();
	const { allPosts, loading, appErr, serverErr, likedPost, disLikedPost } =
		useSelector((state) => state.posts);

	const {
		categoryList,
		loading: catLoading,
		appErr: catAppErr,
		serverErr: catServerErr,
	} = useSelector((state) => state.categories);

	const { userAuth } = useSelector((state) => state.users);

	useEffect(() => {
		dispatch(fetchAllPostsAction(''));
	}, [dispatch, likedPost, disLikedPost]);

	useEffect(() => {
		dispatch(fetchAllCategoriesAction());
	}, [dispatch]);

	return (
		<>
			<section>
				<div className="py-20 bg-gray-900 min-h-screen radius-for-skewed">
					<div className="container mx-auto px-4">
						<div className="mb-10 md:mb-16 flex flex-wrap items-center">
							<div className="w-full lg:w-1/2">
								<span className="text-green-600 font-bold">
									Latest Posts from our awesome authors
								</span>
								<h2 className="text-4xl text-gray-300 lg:text-5xl font-bold font-heading">
									Latest Post
								</h2>
							</div>
							<div className=" block text-right w-full md:w-1/2">
								{/* View All */}
								<button
									onClick={() => dispatch(fetchAllPostsAction(''))}
									className="block md:inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-green-600 hover:bg-green-700 text-gray-50 font-bold leading-loose transition duration-200 mt-8 mx-auto md:mt-0 md:mx-0"
								>
									View All Posts
								</button>
							</div>
						</div>
						<div className="flex flex-wrap -mx-3">
							<div className="mb-8 lg:mb-0 w-full lg:w-1/4 px-3">
								<div className="py-4 px-6 bg-gray-600 shadow rounded">
									<h4 className="mb-4 text-gray-500 font-bold uppercase">
										Categories
									</h4>
									<ul>
										{catLoading ? (
											<HashLoader
												color="#024230"
												loading={true}
												css={override}
											/>
										) : catAppErr || catServerErr ? (
											<div className="text-red-400 text-base">
												{`${catServerErr}-${appErr}`}
											</div>
										) : categoryList?.length === 0 ? (
											<div className="text-xl text-yellow-400 text-center">
												No category
											</div>
										) : (
											categoryList?.map((category) => (
												<li key={category._id}>
													<button
														onClick={() =>
															dispatch(fetchAllPostsAction(category.title))
														}
														className="w-full text-left  cursor-pointer py-2 px-3 mb-4 rounded text-yellow-500 font-bold bg-gray-500"
													>
														{category?.title}
													</button>
												</li>
											))
										)}
									</ul>
								</div>
							</div>
							<div className="w-full lg:w-3/4 px-3">
								{loading ? (
									<Loader />
								) : appErr || serverErr ? (
									<p className="text-2xl text-red-500">{`${serverErr}-${appErr}`}</p>
								) : allPosts?.length === 0 ? (
									<p className="text-2xl text-yellow-500 text-center">
										No posts found
									</p>
								) : (
									allPosts?.map((post, index) => (
										<div
											className="flex flex-wrap bg-gray-900 -mx-3  lg:mb-6"
											key={`${post._id}-${post.title}`}
										>
											<div className="mb-10  w-full lg:w-1/4 px-3">
												<Link to={`/posts/${post._id}`}>
													<img
														className="w-full h-full object-cover rounded"
														src={`${post.image}`}
														alt="postImage"
													/>
												</Link>
												{/* Likes, views dislikes */}
												<div className="flex flex-row bg-gray-300 justify-center w-full  items-center ">
													{/* Likes */}
													<div className="flex flex-row justify-center items-center ml-4 mr-4 pb-2 pt-1">
														<div>
															{post.likes?.find(
																(id) => id === userAuth?._id
															) ? (
																<ThumbUpIcon
																	className="h-7 w-7 text-indigo-600 cursor-pointer"
																	onClick={() =>
																		dispatch(toggleLikeToPostAction(post._id))
																	}
																/>
															) : (
																<ThumbUpIcon
																	className="h-7 w-7 text-gray-600 cursor-pointer"
																	onClick={() =>
																		dispatch(toggleLikeToPostAction(post._id))
																	}
																/>
															)}
														</div>
														<div className="pl-2 text-gray-600">
															{post.likes?.length}
														</div>
													</div>
													{/* Dislike */}
													<div className="flex flex-row  justify-center items-center ml-4 mr-4 pb-2 pt-1">
														<div>
															{post.dislikes?.find(
																(id) => id === userAuth?._id
															) ? (
																<ThumbDownIcon
																	className="h-7 w-7 cursor-pointer text-indigo-600"
																	onClick={() =>
																		dispatch(toggleDislikesAction(post._id))
																	}
																/>
															) : (
																<ThumbDownIcon
																	className="h-7 w-7 cursor-pointer text-gray-600"
																	onClick={() =>
																		dispatch(toggleDislikesAction(post._id))
																	}
																/>
															)}
														</div>
														<div className="pl-2 text-gray-600">
															{post.dislikes?.length}
														</div>
													</div>
													{/* Views */}
													<div className="flex flex-row justify-center items-center ml-4 mr-4 pb-2 pt-1">
														<div>
															<EyeIcon className="h-7 w-7  text-gray-400" />
														</div>
														<div className="pl-2 text-gray-600">
															{post?.numViews}
														</div>
													</div>
												</div>
											</div>
											<div className="w-full lg:w-3/4 px-3">
												<Link to="/" className="hover:underline">
													<h3 className="mb-1 text-2xl text-green-400 font-bold font-heading">
														{post?.title}
													</h3>
												</Link>
												<p className="text-gray-300">{post.description}</p>
												{/* Read more */}
												<Link
													to={`/posts/${post._id}`}
													className="text-indigo-500 hover:underline"
												>
													Read More..
												</Link>
												{/* User Avatar */}
												<div className="mt-6 flex items-center">
													<div className="flex-shrink-0">
														<Link to="/">
															<img
																className="h-10 w-10 rounded-full"
																src={`${post.user.profilePhoto}`}
																alt=""
															/>
														</Link>
													</div>
													<div className="ml-3">
														<p className="text-sm font-medium text-gray-900">
															<Link
																to={`/profile/${post?.user?._id}`}
																className="text-yellow-400 hover:underline "
															>
																{`${post.user.firstName}`}{' '}
																{`${post.user.lastName}`}
															</Link>
														</p>
														<div className="flex space-x-1 text-sm text-green-500">
															<time>
																<DateFormatter date={post?.createdAt} />
															</time>
															<span aria-hidden="true">&middot;</span>
														</div>
													</div>
												</div>
												{/* <p className="text-gray-500">
                          Quisque id sagittis turpis. Nulla sollicitudin rutrum
                          eros eu dictum...
                        </p> */}
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="bg-gray-900">
					<div className="skew bg-green-500 skew-bottom mr-for-radius">
						<svg
							className="h-8 md:h-12 lg:h-10 w-full text-gray-900"
							viewBox="0 0 10 10"
							preserveAspectRatio="none"
						>
							<polygon fill="currentColor" points="0 0 10 0 0 10"></polygon>
						</svg>
					</div>
					<div className="skew bg-gray-500  skew-bottom ml-for-radius">
						<svg
							className="h-8 bg-gray-500 md:h-12 lg:h-20 w-full text-gray-900"
							viewBox="0 0 10 10"
							preserveAspectRatio="none"
						>
							<polygon fill="currentColor" points="0 0 10 0 10 10"></polygon>
						</svg>
					</div>
				</div>
			</section>
		</>
	);
};

export default PostList;
