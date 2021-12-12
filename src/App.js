import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import { AddNewCategory, Home, Login, Register } from './pages';
import CategoryList from './pages/admin/Categories/CategoryList';

function App() {
	return (
		<BrowserRouter>
			<Toaster />
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/add-category" element={<AddNewCategory />} />
				<Route path="/category-list" element={<CategoryList />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
