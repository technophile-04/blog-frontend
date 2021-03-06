import React from 'react';
import { useSelector } from 'react-redux';
import AccountVerificationAlertWarning from './AccountVerificationAlertWarning';
import AdminNavbar from './adminNav/AdminNavbar';
import PrivateNavbar from './privateNav/PrivateNavbar';
import PublicNavbar from './publicNav/PublicNavbar';

const Navbar = () => {
	const { userAuth } = useSelector((store) => store.users);

	if (userAuth) {
		return (
			<>
				{userAuth.isAdmin ? (
					<AdminNavbar isLogin={userAuth} />
				) : (
					<PrivateNavbar isLogin={userAuth} />
				)}
				{!userAuth?.isAccountVerified ? (
					<AccountVerificationAlertWarning />
				) : null}
			</>
		);
	} else {
		return (
			<>
				<PublicNavbar />
			</>
		);
	}
};

export default Navbar;
