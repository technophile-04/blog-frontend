import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateAdminRoute = ({ children }) => {
	const { userAuth } = useSelector((store) => store.users);
	return userAuth?.isAdmin ? children : <Navigate to="/login" />;
};

export default PrivateAdminRoute;
