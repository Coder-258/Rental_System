import { useState } from "react";
import { useAuth } from "./ContextApi/AuthContext";
import { Link } from "react-router-dom";

const Categories = () => {
  const { setCategory } = useAuth();
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  const handleClick = (individualCategory) => {
    if (!user) {
      setMessage("You need to be logged in to view products.");
      setTimeout(() => setMessage(""), 3000); // Message disappears after 3 seconds
    } else {
      setCategory(individualCategory);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
      <div className="container mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-12">
          Explore Our Categories
        </h2>

        {message && (
          <div className="text-center mb-4">
            <p className="text-red-600 font-semibold">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div className="bg-white shadow-xl rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out">
            <img
              src="https://www.codrey.com/wp-content/uploads/2017/12/Consumer-Electronics.png"
              alt="Electronics"
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Electronics</h3>
              {user ? (
                <Link to="/displayCategoryWise">
                  <button onClick={() => handleClick('electronics')} className="bg-blue-600 text-white py-2 px-6 rounded-full text-md transition-transform transform hover:scale-105">
                    See available products
                  </button>
                </Link>
              ) : (
                <button onClick={() => handleClick('electronics')} className="bg-blue-600 text-white py-2 px-6 rounded-full text-md transition-transform transform hover:scale-105">
                  See available products
                </button>
              )}
            </div>
          </div>
          <div className="bg-white shadow-xl rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out">
            <img
              src="https://tse2.mm.bing.net/th?id=OIP.Mb9OcPkBnxsKCXOI3Mkv3AHaF3&pid=Api&P=0&h=180"
              alt="Books"
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Furniture</h3>
              {user ? <Link to="/displayCategoryWise">
                <button onClick={() => handleClick('furniture')} className="bg-blue-600 text-white py-2 px-6 rounded-full text-md transition-transform transform hover:scale-105">
                  See available products
                </button>
              </Link>: <button onClick={() => handleClick('furniture')} className="bg-blue-600 text-white py-2 px-6 rounded-full text-md transition-transform transform hover:scale-105">
                  See available products
                </button>}
            </div>
          </div>
          <div className="bg-white shadow-xl rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out">
            <img
              src="https://tse4.mm.bing.net/th?id=OIP.R8mdt9Cm2zHsylAMY2BhXgHaEo&pid=Api&P=0&h=180"
              alt="Books"
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Books</h3>
              {user ?<Link to="/displayCategoryWise">
                <button onClick={() => handleClick('books')} className="bg-blue-600 text-white py-2 px-6 rounded-full text-md transition-transform transform hover:scale-105">
                  See available products
                </button>
              </Link>:<button onClick={() => handleClick('books')}className="bg-blue-600 text-white py-2 px-6 rounded-full text-md transition-transform transform hover:scale-105">
                  See available products
                </button>}
            </div>
          </div>
          <div className="bg-white shadow-xl rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out">
            <img
              src="https://images.pexels.com/photos/3069868/pexels-photo-3069868.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Books"
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Others</h3>
              {user ? <Link to="/displayCategoryWise">
                <button onClick={() => handleClick('others')} className="bg-blue-600 text-white py-2 px-6 rounded-full text-md transition-transform transform hover:scale-105">
                  See available products
                </button>
              </Link>: <button  onClick={() => handleClick('others')} className="bg-blue-600 text-white py-2 px-6 rounded-full text-md transition-transform transform hover:scale-105">
                  See available products
                </button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
