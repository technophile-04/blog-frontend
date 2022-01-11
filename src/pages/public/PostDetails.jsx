import React, { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import {
	deletePostAction,
	fetchPostAction,
} from '../../redux/slices/post/postsSlice';
import Loader from '../../components/Loader';
import DateFormatter from '../../components/DateFormatter';
import AddComment from '../../components/AddComment';
import CommentsList from '../../components/CommentsList';

const PostDetails = () => {
	const { postId } = useParams();
	const dispatch = useDispatch();
	const { post, loading, appErr, serverErr, isDeleted } = useSelector(
		(state) => state.posts
	);
	const { userAuth } = useSelector((state) => state.users);

	const { comment, deletedComment } = useSelector((state) => state.comments);

	useEffect(() => {
		dispatch(fetchPostAction(postId));
	}, [postId, dispatch, comment, deletedComment]);

	if (isDeleted) {
		return <Navigate to="/posts" />;
	}

	return (
		<>
			{loading ? (
				<Loader />
			) : appErr || serverErr ? (
				<p className="text-red-500 text-2xl text-center">
					{serverErr}-{appErr}
				</p>
			) : (
				<section className="py-20 2xl:py-40 bg-gray-800 overflow-hidden">
					<div className="container px-4 mx-auto">
						{/* Post Image */}
						<img
							className="mb-24 w-full h-96 object-cover"
							src={post?.image}
							alt="post"
						/>
						<div className="max-w-2xl mx-auto text-center">
							<h2 className="mt-7 mb-14 text-6xl 2xl:text-7xl text-white font-bold font-heading">
								{post?.title}
							</h2>

							{/* User */}
							<div className="inline-flex pt-14 mb-14 items-center border-t border-gray-500">
								<img
									className="mr-8 w-20 lg:w-24 h-20 lg:h-24 rounded-full"
									src={post?.user?.profilePhoto}
									alt="user pic"
								/>
								<div className="text-left">
									<h4 className="mb-1 text-2xl font-bold text-gray-50">
										<span className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-orange-600">
											{post?.user?.firstName} {post?.user?.lastName}
										</span>
									</h4>
									<p className="text-gray-500">
										<DateFormatter date={post?.createdAt} />
									</p>
								</div>
							</div>
							{/* Post description */}
							<div className="max-w-xl mx-auto">
								<p className="mb-6 text-left  text-xl text-gray-200">
									{post?.description}
									{userAuth?._id ? (
										post?.user._id === userAuth._id ? (
											<p className="flex">
												<Link className="p-3" to={`/update-post/${postId}`}>
													<PencilAltIcon className="h-8 mt-3 text-yellow-300" />
												</Link>
												<button className="ml-3">
													<TrashIcon
														className="h-8 mt-3 text-red-600"
														onClick={() => dispatch(deletePostAction(postId))}
													/>
												</button>
											</p>
										) : null
									) : null}
								</p>
							</div>
						</div>
					</div>
					{/* Add comment Form component here */}
					<AddComment postId={postId} />

					<div className="flex justify-center  items-center">
						<CommentsList comments={post?.comments} postId={post?._id} />
					</div>
				</section>
			)}
		</>
	);
};

export default PostDetails;
