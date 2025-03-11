import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch rentals from the backend
  const fetchRentals = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:4000/rentals/myRentals", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("response from my rentals", data);
      setRentals(data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to return the product using PUT
  const returnProduct = async (rentalId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:4000/rentals/return/${rentalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
        // Send the updated status in the request body
        body: JSON.stringify({ isAvailable: true }),
      });

      if (response.ok) {
        const updatedRental = await response.json();
        console.log("Product returned:", updatedRental);
        toast.success("Item successfully returned!");
        // Update the rentals list with the returned product
        setRentals((prevRentals) =>
          prevRentals.map((rental) =>
            rental._id === rentalId ? { ...rental, isAvailable: true } : rental
          )
        );
        // Optionally re-fetch rentals to get the most recent data
        fetchRentals();
      } else {
        console.error("Error returning product:", await response.text());
      }
    } catch (error) {
      console.error("Error during return:", error);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []); // Fetch rentals once on component mount

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg min-h-[75vh]">
      {loading ? (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">My Rentals</h2>
          <p className="text-center text-gray-600">Loading rentals...</p>
        </div>
      ) : rentals.length === 0 ? (
        <p className="text-center font-bold text-2xl mt-8 text-gray-500">No rentals found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Item</th>
              <th className="border p-2">Return Date</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr key={rental._id} className="text-center border">
                <td className="border p-2">{rental.item?.title || "N/A"}</td>
                <td className="border p-2">
                  {new Date(rental.returnDate).toLocaleDateString()}
                </td>
                <td className="border p-2">${rental.price}</td>
                <td className="border p-2 text-green-600">
                      {rental.item?.isAvailable ? "Returned" : "Unreturned"}
                </td>
                <td className="border p-2">
  {!rental.item?.isAvailable && (
    <button
      onClick={() => returnProduct(rental._id)}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
    >
      Return
    </button>
  )}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyRentals;