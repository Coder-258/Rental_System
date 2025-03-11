import { Link, useNavigate } from 'react-router-dom'
import { FiUser } from "react-icons/fi"; // Profile icon
import { IoMdClose } from "react-icons/io"; // Close icon
import { useState } from 'react';
import { useAuth } from './ContextApi/AuthContext';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { user, setUser,isSellerLoggedIn } = useAuth();
  const [logoutMessage, setLogoutMessage] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [isloggedOut, setIsLoggedOut] = useState(false);
  const [sellerMessage, setSellerMessage] = useState('');
  const navigate = useNavigate();
  const handleDisplayProfile = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("http://localhost:4000/user/getProfile", {
          method: "GET",
          headers: {
            'Authorization': `${token}`
          }
        });
        const data = await response.json();
        if (response.status === 200) {
          console.log(data);
          setUserProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  };
const showProductMessage = () => {
  setMessage('Please log in to view all products.');
  setTimeout(() => {
    setMessage('');
  }, 2000);
}
  const showMessage = () => {
    setMessage('Please log in to access your profile.');
    setTimeout(() => {
      setMessage('');
    }, 2000);
  };
  const showSellerMessage = () => {
    setSellerMessage('Please log in as seller to list an item.');
    setTimeout(() => {
      setSellerMessage('');
    }, 2000);
  };

  const showLogOutMessage = () => {
    setTimeout(() => setLogoutMessage(''), 3000);
    setTimeout(() => {
      setIsLoggedOut(false);
      setLogoutMessage('');
    }, 3000);
  };

  const handleLogOut = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        const response = await fetch("http://localhost:4000/user/logout", {
          method: "GET",
          headers: {
            'Authorization': `${token}`
          }
        });
        console.log("Logout response:", response);
        if (response.status === 200) {
          setIsSidebarOpen(false);
          setIsLoggedOut(true);
          localStorage.removeItem("token");
          setLogoutMessage('You logged out successfully');
          showLogOutMessage();
          setUser(false);
          setTimeout(() => setLogoutMessage(''), 3000);
          navigate("/")
        } else {
          console.error("Failed to log out");
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <div className="bg-gray-100">
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="container mx-auto flex justify-between items-center p-4">
            <h1 className="text-xl font-bold text-blue-600">P2P Rentals</h1>
            <nav className="flex items-center space-x-4">
              <Link to='/' className="text-gray-600 hover:text-blue-600">Home</Link>
              <Link to='/categories' className="text-gray-600 hover:text-blue-600">Categories</Link>
              <button
                onClick={user ? undefined : showProductMessage}
                className="text-gray-600 hover:text-blue-600"
              >
                {user ? <Link to='/viewAllProducts'>View all products</Link> : 'View all products'}
              </button>
              <button
                onClick={isSellerLoggedIn?  undefined: showSellerMessage}
                className="text-gray-600 hover:text-blue-600"
              >
                {isSellerLoggedIn ? <Link to='/listItem'>List an Item</Link> : 'List an Item'}
              </button>
              {sellerMessage && (
                    <div className="absolute top-12 right-0 transform -translate-x-1/2 bg-yellow-300 text-black px-3 py-1 rounded shadow-md whitespace-nowrap">
                          {sellerMessage}
                    </div>
              )}
           {!(user || isSellerLoggedIn) && (
  <Link to='/login'>
    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login/Signup</button>
  </Link>
)}
              <div className="profile">
                <button onClick={user ? () => setIsSidebarOpen(true) : showMessage} className="text-2xl p-2 hover:text-gray-400 transition">
                  <FiUser />
                </button>
                {message && (
                  <div className="absolute top-12 right-0 transform -translate-x-1/2 bg-yellow-300 text-black px-3 py-1 rounded shadow-md whitespace-nowrap">
                    {message}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </header>
      </div>

      <div className={`fixed top-0 right-0 h-screen w-64 bg-gray-800 text-white shadow-lg transform transition-transform z-20 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Profile</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-2xl hover:text-gray-400 transition">
            <IoMdClose />
          </button>
        </div>

        {userProfile ? (
          <div className="p-4">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-white font-bold">
                  {userProfile.fullName.firstName[0]}{userProfile.fullName.lastName[0]}
                </span>
              </div>
              <h3 className="text-xl font-semibold">
                {userProfile.fullName.firstName} {userProfile.fullName.lastName}
              </h3>
              <p className="text-gray-400">{userProfile.email}</p>
            </div>
            <div className="space-y-3 text-sm">
              <p>Member since: 1 month</p>
              {/* Add more user details here */}
            </div>
            <button 
              onClick={() => setUserProfile(null)} 
              className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Close Profile
            </button>
          </div>
        ) : (
          <nav className="flex flex-col p-4 space-y-3">
            <button className="p-3 rounded-lg text-left hover:bg-gray-700 transition" onClick={handleDisplayProfile}>👤 My Account</button>
            <Link to='/myRentals' className="p-3 rounded-lg hover:bg-gray-700 transition">📦 My Rentals</Link>
            <Link to="/seller/signUp" className="p-3 rounded-lg hover:bg-gray-700 transition">👤 SignUp As Seller</Link>
            <button className="p-3 rounded-lg hover:bg-gray-700 transition text-left" onClick={handleLogOut}>🚪 Logout</button>
          </nav>
        )}
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>}
      {isloggedOut && <p className="absolute top-16 right-24 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg text-sm font-medium">{logoutMessage}</p>}
    </>
  )
}

export default Navbar