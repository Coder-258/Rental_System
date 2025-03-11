import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "./ContextApi/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SellerLogin = () => {
    const navigate=useNavigate();
    const [formData,setFormData]=useState({
        email:"",
        password:""
    })
    const {setIsSellerLoggedIn}=useAuth(); 
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const response = await fetch('http://localhost:4000/seller/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,  // Replace with user input
              password: formData.password  // Replace with user input
            }),
          });
          const data=await response.json();
          localStorage.setItem("Seller_token", data.token);
          console.log("Seller token: ",data.token);
          console.log("Seller data: ",data);
          if(response.status===201){
            console.log("Response: ",data);
            setFormData({email:"",password:""});
            toast.success("You Logged In Successfully");
            setIsSellerLoggedIn(true);
            navigate("/seller/dashboard");
          }
    }
    return (
    <>
        <>
      <div className=" flex flex-col h-[75vh] w-screen flex flex-col items-center justify-center bg-gradient-to-r from-violet-500 to-fuchsia-500">
        <div className="flex flex-col bg-neutral-50 w-[25vw] h-[50vh] items-center rounded-2xl">
        <p className="mt-4 pt-4 font-mono font-bold text-sky-600 text-2xl	 ">Welcome back to marketplace</p>
        <form action="" onSubmit={handleSubmit} className="flex flex-col h-[30vh] mt-6 items-center ml-0 ">
           <label htmlFor="email" className="items-left">Email</label>
           <input type="email"required name="email" value={formData.email} onChange={handleChange} className="w-[250px] bg-slate-300 text-center rounded-lg mt-2"placeholder="xyz@gmail.com" />
           <label htmlFor="password" className="mt-2 pt-2">Password </label>
           <input type="Password" name="password" required onChange={handleChange}value={formData.password} minLength={8} className="w-[250px] bg-slate-300 text-center rounded-lg mt-2" placeholder="******" />
           
           <button className="mt-6 bg-violet-500 w-[100px] rounded-lg h-[40px]"type="submit">Login</button>
           <p className="mt-4 pt-2">Do not have account? <Link to='/seller/signUp' className="text-blue-800 underline"> Create your account</Link></p>
        </form>
        </div>
        
      </div>
    </>
    </>
  )
}

export default SellerLogin