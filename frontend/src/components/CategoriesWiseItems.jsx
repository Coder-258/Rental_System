import { useAuth } from "./ContextApi/AuthContext"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const CategoriesWiseItems = () => {
    const {category}=useAuth();
    const [items,setItems]=useState([]);
    const fecthData=async()=>{
        if(!category){
            console.log("Category not found");
        }
        else{
            try{
                const response = await fetch(`http://localhost:4000/items/getCategoryWiseItems?category=${category}`);
                const data=await response.json();
                setItems(data);
                console.log(data);
            }catch(error){
                console.log("Error",error);
            }
        }
        
    }
    useEffect(()=>{
        fecthData();
    },[category]);
    return (
        <div className="flex flex-wrap m-8 gap-4">
          {items.map((item) => (
            
            <div key={item._id} className="max-w-sm bg-white rounded-2xl w-[90vw] shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl">
              <img src={`http://localhost:4000/${item.images[0]}`} alt={item.title} className="w-[200px] h-64 object-cover ml-[25%] rounded-t-2xl" />
              <div className="p-5">
                <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
                <div className="text-sm text-gray-500 mt-2 italic">
                            <p>Please note: This is a rental item. Availability and prices are subject to change. Prices are on per day basis.</p>
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
                      <span className="font-semibold">Available From:</span> {new Date(item.availableFrom).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Available To:</span> {new Date(item.availableTo).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Link to={item.isAvailable?"/rentAnItem":window.location.href}><button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all">
                  {item.isAvailable?"Rent Now":"Not Available"}
                </button></Link>
              </div>
            </div>
          ))}
        </div>
      );
      
      
};

 

export default CategoriesWiseItems