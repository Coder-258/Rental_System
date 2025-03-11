import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ListItem = () => {
// eslint-disable-next-line react-hooks/rules-of-hooks
const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    availableFrom: "",
    availableTo: "",
    images: [],
})
  const formDataToSend = new FormData();
  
  // Append regular form data fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('availableFrom', formData.availableFrom);
      formDataToSend.append('availableTo', formData.availableTo);
    
      // Append images as individual files
      for (let i = 0; i < formData.images.length; i++) {
        formDataToSend.append('images', formData.images[i]);
      }
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleImageChange = (e) => {
        setFormData({ ...formData, images: [...e.target.files] });
      };
    // const token=localStorage.getItem("token");
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const sellertoken = localStorage.getItem("Seller_token");
  
          const response = await fetch('http://localhost:4000/items/listItem', {
              method: 'POST',
              headers: {
                  'Authorization': `${sellertoken}`
                  // Do NOT set 'Content-Type' manually when using FormData
              },
              body: formDataToSend, // Send FormData directly
          });
  
          const data = await response.json();
          if (response.status === 201) {
              console.log("Response: ", data);
              setFormData({
                  title: "",
                  description: "",
                  price: "",
                  category: "",
                  availableFrom: "",
                  availableTo: "",
                  images: []
              });
              toast.success("Item listed successfully");
          }
      } catch (err) {
          console.log("Error: ", err);
      }
  };
  
    
      return (
        <div className="flex flex-col h-sreen-height  w-screen items-center justify-center bg-gradient-to-r from-violet-500 to-fuchsia-500">
          <div className="flex flex-col bg-neutral-50 w-[30vw] h-auto p-6 mt-8 mb-8 rounded-2xl">
            <p className="mb-4 font-mono font-bold text-sky-600 text-2xl">List Your Item</p>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 ">
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Item Title" required />
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Description" required></textarea>
              <input type="number" min={0} name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Price" required />
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-lg" required>
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="books">Books</option>
                <option value="others">Others</option>
              </select>
              <label>Available From:</label>
              <input type="date" name="availableFrom" value={formData.availableFrom} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
              <label>Available To:</label>
              <input type="date" name="availableTo" value={formData.availableTo} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
              <label>Upload Images:</label>
              <input type="file" multiple onChange={handleImageChange} className="w-full p-2 border rounded-lg" accept="image/*" />
              <button className="mt-4 bg-violet-500 w-full rounded-lg h-[40px] text-white" type="submit">List Item</button>
            </form>
          </div>
        </div>
      );
}

export default ListItem