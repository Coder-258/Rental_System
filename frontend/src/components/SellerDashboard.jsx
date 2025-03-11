import { useEffect, useState } from "react";
import { FiHome, FiList, FiDollarSign,  FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SellerDashboard = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const token=localStorage.getItem("Seller_token");
  const [sellerName, setSellerName] = useState("");
  const handleLogout = async () => { 
    try{
      const response = await fetch('http://localhost:4000/seller/logout', {
        method: 'GET',
        headers: {
          'Authorization': `${token}`  
    }
    });
    const data = await response.json();
    console.log("data",data);
    localStorage.removeItem("Seller_token");
    toast.success("You Logged Out Successfully");
    window.location.href = "/seller/login";
  }
    catch(error){
      console.log("error",error);
    }
  }
  useEffect(() => {
    const fetchRentals = async () => {
      const sellertoken = localStorage.getItem("Seller_token");
      console.log("Seller token",token);
      if(!token){
        return window.location.href = "/seller/login";
      }
        try {
            const sellerResponse = await fetch("http://localhost:4000/seller/getProfile", {
                method: "GET",
                headers: {
                  "Authorization": `${sellertoken}`,
                },
              });
              const sellerData = await sellerResponse.json();
              console.log("seller data",sellerData);
              setSellerName(sellerData.fullName.firstName.toUpperCase());
          const response = await fetch("http://localhost:4000/items/getSellerItems", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
              "Authorization": `${sellertoken}`
            }
          });
          const data = await response.json();
          setRentals(data);
          console.log("response from seller items",rentals)
        } catch (error) {
          console.error("Error fetching rentals:", error);
        } finally {
          setLoading(false);
        }
      };
    fetchRentals();
  }, [token]);

  // Calculate total earnings
  const totalEarnings = rentals.reduce((sum, rental) => sum + (rental.price || 0), 0);

  // Count active listings
  const activeListings = rentals.filter(rental => rental.isAvailable).length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-5">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Seller Dashboard</h2>
        <nav className="space-y-4">
          <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
            <FiHome className="text-lg" />
            <span>Dashboard</span>
          </a>
          <Link to="/listItem" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
            <FiList className="text-lg" />
            <span>List an Item</span>
          </Link>
          <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
            <FiDollarSign className="text-lg" />
            <span>Earnings</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
            <FiLogOut className="text-lg" />
            <button onClick={handleLogout}>Logout</button>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">

          <h1 className="text-2xl font-bold text-gray-800">Welcome, {sellerName}</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-gray-600">Total Rentals</h3>
            <p className="text-2xl font-bold">{rentals.length}</p>
          </div>
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-gray-600">Total Earnings</h3>
            <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-gray-600">Active Listings</h3>
            <p className="text-2xl font-bold">{activeListings}</p>
          </div>
        </div>

        {/* Recent Rentals Table */}
        <div className="bg-white p-6 shadow-md rounded-lg mt-6">
          <h2 className="text-lg font-bold mb-4">Recent Rentals</h2>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : rentals.length === 0 ? (
            <p className="text-gray-500">No rentals available.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Item</th>
                  <th className="border p-2">Category</th>
                  <th className="border p-2">Return Date</th>
                  <th className="border p-2">Price</th>
                </tr>
              </thead>
              <tbody>
  {rentals.map((rental) => (
    <tr key={rental._id} className="text-center border">
      <td className="border p-2">{rental.title || "N/A"}</td>
      <td className="border p-2">{rental.category || "N/A"}</td>
      <td className="border p-2">{rental.availableTo ? new Date(rental.availableTo).toLocaleDateString() : "N/A"}</td>
      <td className="border p-2">${rental.price}</td>
    </tr>
  ))}
</tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;