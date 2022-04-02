import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import PrivateAdminRoute from './components/PrivateAdminRoute';
import PrivateRoute from './components/PrivateRoute';
import {
	Home,
	Login,
	Register,
	PostList,
	PostDetails,
	ForgotPassword,
	ResetPassword,
} from './pages/public';
import {
	AddNewCategory,
	CategoryList,
	UpdateCategory,
} from './pages/admin/Categories';

import {
	AccountVerified,
	CreatePost,
	Profile,
	SendEmail,
	UpdatePassword,
	UpdatePost,
	UpdateProfileForm,
	UploadProfilePhoto,
} from './pages/private';
import { UsersList } from './pages/admin/UsersList';

function App() {
	return (
		<BrowserRouter>
			<Toaster />
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />

				<Route
					path="/add-category"
					element={
						<PrivateAdminRoute>
							<AddNewCategory />
						</PrivateAdminRoute>
					}
				/>
				<Route
					path="/send-email"
					element={
						<PrivateAdminRoute>
							<SendEmail />
						</PrivateAdminRoute>
					}
				/>
				<Route
					path="/category/:id"
					element={
						<PrivateAdminRoute>
							<UpdateCategory />
						</PrivateAdminRoute>
					}
				/>
				<Route
					path="/category-list"
					element={
						<PrivateAdminRoute>
							<CategoryList />
						</PrivateAdminRoute>
					}
				/>
				<Route
					path="/users"
					element={
						<PrivateAdminRoute>
							<UsersList />
						</PrivateAdminRoute>
					}
				/>

				<Route
					path="/create-post"
					element={
						<PrivateRoute>
							<CreatePost />
						</PrivateRoute>
					}
				/>
				<Route
					path="/update-post/:postId"
					element={
						<PrivateRoute>
							<UpdatePost />
						</PrivateRoute>
					}
				/>
				<Route
					path="/upload-profile-photo"
					element={
						<PrivateRoute>
							<UploadProfilePhoto />
						</PrivateRoute>
					}
				/>
				<Route
					path="/update-profile"
					element={
						<PrivateRoute>
							<UpdateProfileForm />
						</PrivateRoute>
					}
				/>
				<Route
					path="/profile/:userId"
					element={
						<PrivateRoute>
							<Profile />
						</PrivateRoute>
					}
				/>
				<Route
					path="/update-password"
					element={
						<PrivateRoute>
							<UpdatePassword />
						</PrivateRoute>
					}
				/>
				<Route
					path="/verify-token/:tokenId"
					element={
						<PrivateRoute>
							<AccountVerified />
						</PrivateRoute>
					}
				/>

				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/posts" element={<PostList />} />
				<Route path="/posts/:postId" element={<PostDetails />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/reset-password/:token" element={<ResetPassword />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
