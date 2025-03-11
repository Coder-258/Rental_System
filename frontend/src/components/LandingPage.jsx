import  { useState } from 'react'
// import { useAuth } from './ContextApi/AuthContext'; // Adjust the import path as necessary
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom'; 
import { useAuth } from './ContextApi/AuthContext';
const LandingPage = () => {
  const {user}=useAuth();
    const [search, setSearch] = useState('')
    const [userSearched, setUserSearched] = useState(false);
    const [products,setProducts]=useState([]);
    const searchedProducts= async()=>{
      try{
        const response = await fetch(`http://localhost:4000/items/search?search=${search}`)
        const data = await response.json();
        console.log(data);
        setProducts(data);
        setUserSearched(true);
      }catch(error){
        console.error("Error fetching rentals:", error);
      }
    }
    const {setCategory}=useAuth();
    const [message, setMessage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPrice, setSelectedPrice] = useState('all');
    const handleClick=(e)=>{
      if (!user) {
        setMessage("You need to be logged in to explore.");
        setTimeout(() => setMessage(""), 3000); // Message disappears after 3 seconds
      } else {
        setCategory(e.target.innerText.toLowerCase());
      }
    }
  return (
    <>
      {/* Hero Section */}
      <section className="bg-blue-500 text-white py-20 mt-10 mb-10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Rent Anything, Anytime</h2>
          <p className="mb-6">Find what you need or rent out your own items in just a few clicks.</p>
          <div className="flex justify-center items-center w-full max-w-md mx-auto">
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              type="text"
              placeholder="What are you looking for?"
              className="flex-grow px-4 py-2 rounded-l shadow-md border border-gray-300 focus:outline-none text-gray-800"
            />
            <button
              className="px-4 py-2 bg-gray-300 rounded-r shadow-md text-gray-700 hover:bg-gray-400 focus:outline-none"
              aria-label="Search" onClick={searchedProducts}
            >
              <FiSearch size={24} />
            </button>
          </div>
        </div>
      </section>
      {/* Filters Section */}
      <section className="container mx-auto mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Filters</h3>
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded shadow-sm"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="furniture">Furniture</option>
            <option value="others">Others</option>
          </select>
          <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded shadow-sm"
          >
            <option value="all">All Prices</option>
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100+">$100+</option>
          </select>
        </div>
      </section>
      {products && products.length>0 ?(
      <div className="flex flex-wrap m-8 gap-4">
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
              <span className="font-semibold">Category:</span> {item.category}
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
           <p className="text-sm text-red-500 mt-2 italic">
              You need to go to categories or view all products page to rent the item
            </p>
        </div>
      </div>
    </div>
  ))}
</div>):  userSearched && products.length === 0 ? (
   <p className="text-md text-gray-900 mt-2 ml-[120px] font-bold italic">
   No product found. Please try again with a different search term.
 </p>
):null}

      {message && (
          <div className="text-center mb-4" style={{ display: message ? "block" : "none" }}>
            <p className="text-red-600 font-semibold">{message}</p>
          </div>
        )}
      {/* Categories Section */}
      <section id="categories" className="py-10">
     
  <div className="container mx-auto">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">Featured Categories</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white shadow-md rounded p-4 text-center">
      <img
        src='https://www.codrey.com/wp-content/uploads/2017/12/Consumer-Electronics.png'
        alt="Electronics"
        className="w-full h-40 object-cover rounded-t-lg mb-4"
      />
      {user ? <Link to="/displayCategoryWise"><button className="text-xl font-bold bg-blue-600 text-white w-[150px] h-[35px] rounded-2xl" onClick={handleClick}>Electronics</button></Link>:<button className="text-xl font-bold bg-blue-600 text-white w-[150px] h-[35px] rounded-2xl" onClick={handleClick}>Electronics</button>}
      
      <p className="text-gray-600 mt-2">Explore our wide selection of electronic gadgets</p>
    </div>
    <div className="bg-white shadow-md rounded p-4 text-center">
      <img
        src='https://tse4.mm.bing.net/th?id=OIP.R8mdt9Cm2zHsylAMY2BhXgHaEo&pid=Api&P=0&h=180' // Add an image URL
        alt="Others"
        className="w-full h-40 object-cover rounded-t-lg mb-4"
      />
      {user ? <Link to="/displayCategoryWise"><button className="text-xl font-bold bg-blue-600 text-white w-[150px] h-[35px] rounded-2xl" onClick={handleClick}>Books</button></Link> : <button className="text-xl font-bold bg-blue-600 text-white w-[150px] h-[35px] rounded-2xl" onClick={handleClick}>Books</button>}
      <p className="text-gray-600 mt-2">Explore our wide range of books</p>
    </div>
</div>

  </div>
</section>
    </>
  )
}

export default LandingPage 