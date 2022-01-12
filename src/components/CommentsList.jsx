import Comment from './Comment';

const CommentsList = ({ comments }) => {
	return (
		<div>
			<ul className="divide-y bg-gray-700 w-96 divide-gray-200 p-3 mt-5">
				<div className="text-gray-400">{comments?.length} Comments</div>
				<>
					{comments?.length <= 0 ? (
						<h1 className="text-yellow-400 text-lg text-center">No comments</h1>
					) : (
						comments?.map((comment) => <Comment comment={comment} />)
					)}
				</>
			</ul>
		</div>
	);
};

export default CommentsList;
