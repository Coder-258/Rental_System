import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./ContextApi/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SellerSignUp = () => {
    const [errorMessage,setErrorMessage]=useState('');
    const [formData, setFormData] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        phoneNumber:"",
        bankAccount:""
    })
    const { setIsSellerLoggedIn}=useAuth();
    const navigate=useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    const handleSubmit=async (e)=>{
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/seller/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password:formData.password,
                    phoneNumber:formData.phoneNumber,
                    bankAccount:formData.bankAccount
                })
            });
    
            // ✅ Check if response is OK before parsing JSON
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Signup failed:", errorData);
                setErrorMessage(errorData.errors?.map(err => err.msg).join(". ") || "Signup failed. Please try again.");
                return;
            }
            const data=await response.json();
            if(response.status===201){
                console.log("Response: ",data);
                setFormData({
                    firstName:"",
                    lastName:"",
                    email:"",
                    password:"",
                    phoneNumber:"",
                    bankAccount:""
                });
                setIsSellerLoggedIn(true);
                localStorage.setItem("Seller_token", data.token);
                toast.success("You Signed Up Successfully");
                console.log("seller token", data.token);
                navigate("/seller/dashboard");
            }
           
        }catch(error){
            console.log("error occured: ",error);
        }
    }
    return (
        <>

            <div className="flex justify-center items-center h-[75vh] bg-gradient-to-r from-violet-500 to-fuchsia-500">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Signup as Seller</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="flex gap-4">
                            <input type="text"name="firstName" value={formData.firstName} 
                                placeholder="First Name"
                                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                minLength={3}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="lastName" value={formData.lastName}
                                placeholder="Last Name"
                                className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                minLength={3}
                                onChange={handleChange}
                            />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email" value={formData.email}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            minLength={5}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password" value={formData.password}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number" value={formData.phoneNumber}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            minLength={10}
                            maxLength={10}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="bankAccount"
                            placeholder="Bank Account Number" value={formData.bankAccount}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            minLength={16}
                            maxLength={16}
                            onChange={handleChange}
                        />
                        <p className={`mt-2 text-red-600 ${errorMessage ? "visible" : "invisible"}`}>
            {errorMessage}
          </p>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Sign Up
                        </button>
                        <p>Already have an account? <Link to='/seller/login' className='text-blue-900 underline'>Login here</Link></p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SellerSignUp