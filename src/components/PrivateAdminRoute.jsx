import { useSelector } from 'react-redux';
import Page404 from '../pages/Page404/Page404';

const PrivateAdminRoute = ({ children }) => {
	const { userAuth } = useSelector((store) => store.users);
	return userAuth?.isAdmin ? children : <Page404 />;
};

export default PrivateAdminRoute;
