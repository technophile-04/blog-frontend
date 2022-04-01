import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsersAction } from '../../../redux/slices/user/userSlice';
import UsersListHeader from './UsersListHeader';
import UsersListItem from './UsersListItem';
import Loader from '../../../components/Loader';

const UsersList = () => {
	const dispatch = useDispatch();
	const { allUsers, appErr, serverErr, loading, block, unblock } = useSelector(
		(store) => store.users
	);

	useEffect(() => {
		dispatch(fetchAllUsersAction());
	}, [dispatch, block, unblock]);

	return (
		<>
			<section className="py-8 bg-gray-900 min-h-screen">
				<UsersListHeader />
				<div className="container px-4 mx-auto">
					{loading ? (
						<Loader />
					) : appErr || serverErr ? (
						<h3 className="text-yellow-600 text-center text-lg">
							{serverErr} {appErr}
						</h3>
					) : (
						allUsers?.map((user) => (
							<UsersListItem user={user} key={user?._id} />
						))
					)}
				</div>
			</section>
		</>
	);
};

export default UsersList;
