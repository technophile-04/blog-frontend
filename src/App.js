import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import PrivateAdminRoute from './components/PrivateAdminRoute';
// import PrivateRoute from './components/PrivateRoute';
import { AddNewCategory, Home, Login, Register } from './pages';
import CategoryList from './pages/admin/Categories/CategoryList';
import UpdateCategory from './pages/admin/Categories/UpdateCategory';

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
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
