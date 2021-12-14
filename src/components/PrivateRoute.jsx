import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, ...rest }) => {
	const { userAuth } = useSelector((store) => store.users);

	return userAuth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
