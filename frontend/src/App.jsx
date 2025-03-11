

import './App.css'
import Footer from './components/Footer'
import LandingPage from './components/LandingPage'
import Navbar from './components/Navbar'
import {  Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage'
import Categories from './components/Categories';
import SignUpPage from './components/SignUpPage';
import { AuthProvider } from './components/ContextApi/AuthContext';
import SellerSignUp from './components/SellerSignUp';
import SellerLogin from './components/SellerLogin';
import ListItem from './components/ListItem';
import CategoriesWiseItems from './components/CategoriesWiseItems';
import DisplayAllProducts from './components/displayAllProducts';
import MyRentals from './components/MyRentals';
import SellerDashboard from './components/SellerDashboard';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from "react-toastify";

function App() {
  const location = useLocation();
  return (
    <>
    <AuthProvider>
           {location.pathname!=='/seller/dashboard' && <Navbar />}
        <Routes>
           <Route path="/" element={<LandingPage />} />
           <Route path="/login" element={<LoginPage />} />
           <Route path="/viewAllProducts" element={<DisplayAllProducts/>}/>
           <Route path="/myRentals" element={<MyRentals/>}/>
           <Route path="/categories" element={<Categories />} />
           <Route path="/signUp" element={<SignUpPage />} />
           <Route path="/seller/signUp" element={<SellerSignUp/>}/>
           <Route path="/seller/login" element={<SellerLogin/>}/>
           <Route path="/listItem" element={<ListItem/>}/>
           <Route path="/displayCategoryWise" element={<CategoriesWiseItems/>}/>
           <Route path="/seller/dashboard" element={<SellerDashboard/>}/>
        </Routes>
           <Footer />
      </AuthProvider>
<ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  )
}

export default App