
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const DisplayAllProducts = () => {
  const [products, setProduct] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [returnDate, setReturnDate] = useState("");

  const fetchAllProducts = async () => {
    try {
      const response = await fetch("http://localhost:4000/items/getAllItems");
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      toast.error("Error fetching products!");
      console.log("Error occurred:", error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setReturnDate("");
  };

  const rentItem = async () => {
    if (!returnDate) {
      toast.error("Please enter a valid return date.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to rent an item.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/rentals/rent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: selectedItem._id,
          returnDate,
          price: selectedItem.price,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Item rented successfully!");
        fetchAllProducts();
        closeModal();
      } else {
        toast.error(data.message || "Failed to rent item.");
      }
    } catch (error) {
      toast.error("An error occurred. Try again later.");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-wrap m-8 gap-4">
      <Toaster position="top-right" reverseOrder={false} />
      {products.map((item) => (
        <div
          key={item._id}
          className="max-w-sm bg-white rounded-2xl w-[90vw] shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl"
        >
          <img
            src={`http://localhost:4000/${item.images[0]}`}
            alt={item.title}
            className="w-[200px] h-64 object-cover ml-[25%] rounded-t-2xl"
          />
          <div className="p-5">
            <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
            <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
            <div className="text-sm text-gray-500 mt-2 italic">
              <p>
                Please note: This is a rental item. Availability and prices are
                subject to change. Prices are on per day basis.
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="text-gray-700">
                  <span className="font-semibold">Price:</span> ${item.price}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Category:</span>{" "}
                  {item.category}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700">
                  <span className="font-semibold">Available From:</span>{" "}
                  {new Date(item.availableFrom).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Available To:</span>{" "}
                  {new Date(item.availableTo).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (item.isAvailable) {
                  openModal(item);
                }
              }}
              className={item.isAvailable ? "mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all" : "mt-4 w-full bg-gray-600 text-white py-2 rounded-xl"}
            >
              {item.isAvailable ? "Rent Now" : "Not Available"}
            </button>
          </div>
        </div>
      ))}

      {/* Modal Component */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              Rent {selectedItem.title}
            </h2>
            <p className="mb-2">
              Enter the return date for this item (DD-MM-YYYY):
            </p>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="border p-2 w-full rounded-md"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={rentItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Rent Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayAllProducts;
