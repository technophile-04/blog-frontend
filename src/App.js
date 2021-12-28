import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import PrivateAdminRoute from './components/PrivateAdminRoute';
import PrivateRoute from './components/PrivateRoute';
import { Home, Login, Register, PostList, PostDetails } from './pages/public';
import {
	AddNewCategory,
	CategoryList,
	UpdateCategory,
} from './pages/admin/Categories';

import { CreatePost } from './pages/private';

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
					path="/create-post"
					element={
						<PrivateRoute>
							<CreatePost />
						</PrivateRoute>
					}
				/>
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/posts" element={<PostList />} />
				<Route path="/posts/:postId" element={<PostDetails />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
