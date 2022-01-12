import { PencilAltIcon, TrashIcon, XCircleIcon } from '@heroicons/react/solid';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCommentAction } from '../redux/slices/comment/commentsSlice';
import { useState } from 'react';
import AddComment from './AddComment';

const Comment = ({ comment }) => {
	const { userAuth } = useSelector((store) => store.users);
	const [isEditing, setIsEditing] = useState(false);

	const dispatch = useDispatch();

	return (
		<>
			<li className="py-4  w-full">
				<div className="flex space-x-3">
					<img
						className="h-6 w-6 rounded-full"
						src={comment?.user?.profilePhoto}
						alt=""
					/>
					<div className="flex-1 space-y-1">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-medium text-green-400">
								{comment?.user?.firstName} {comment?.user?.lastName}
							</h3>
							<p className="text-bold text-yellow-500 text-base ml-5">
								<Moment fromNow ago>
									{comment?.updatedAt}
								</Moment>{' '}
								ago
							</p>
						</div>
						<p className="text-sm text-gray-400">{comment?.description}</p>
						{/* Check if is the same user created this comment */}
						{userAuth?._id &&
							(userAuth?._id === comment?.user?._id ? (
								<p className="flex">
									<button className="p-3" onClick={() => setIsEditing(true)}>
										<PencilAltIcon className="h-5 mt-3 text-yellow-300" />
									</button>
									<button
										className="ml-3"
										onClick={() => dispatch(deleteCommentAction(comment?._id))}
									>
										<TrashIcon className="h-5 mt-3 text-red-600" />
									</button>
								</p>
							) : null)}
						{isEditing && (
							<div className="flex items-center justify-center">
								<AddComment commentId={comment?._id} />
								<button onClick={() => setIsEditing(false)}>
									<XCircleIcon className="h-5 text-yellow-300" />
								</button>
							</div>
						)}
					</div>
				</div>
			</li>
		</>
	);
};

export default Comment;
