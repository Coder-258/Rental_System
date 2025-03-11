import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./ContextApi/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const LoginPage = () => {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [errorMessage,setErrorMessage]=useState('');
  const {setUser}=useAuth();
  const navigate=useNavigate();
  const handleSubmit=async (e)=>{
    e.preventDefault();
    const response = await fetch('http://localhost:4000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,  // Replace with user input
        password: password  // Replace with user input
      }),
    });
    const data = await response.json();
    console.log("token of data",data.token)
    localStorage.setItem("token", data.token);
    console.log(localStorage.getItem("token"))
    if(response.status===201){
      console.log(data);
      setUser(true);
      setEmail('');
      setPassword('');
      console.log(response.json)
      toast.success("You Logged In Successfully");
      navigate("/")

    }else{
      
        // setErrorMessage(data.map((err) => err.msg).join(". ")); // Show all errors
      
        setErrorMessage("Login failed. Please try again.");
      
    }
  }
  return (
    <>
      <div className=" flex flex-col h-[75vh] w-screen flex flex-col items-center justify-center bg-gradient-to-r from-violet-500 to-fuchsia-500">
        <div className="flex flex-col bg-neutral-50 w-[25vw] h-[50vh] items-center rounded-2xl">
        <p className="mt-4 pt-4 font-mono font-bold text-sky-600 text-2xl	 ">Welcome back</p>
        <form action="" onSubmit={handleSubmit} className="flex flex-col h-[30vh] mt-6 items-center ml-0 ">
           <label htmlFor="email" className="items-left">Email</label>
           <input type="email" onChange={(e) => setEmail(e.target.value)} required name="email" value={email} className="w-[250px] bg-slate-300 text-center rounded-lg mt-2"placeholder="xyz@gmail.com" />
           <label htmlFor="password" className="mt-2 pt-2">Password </label>
           <input type="Password" name="password" required onChange={(e) => setPassword(e.target.value)} minLength={8} value={password} className="w-[250px] bg-slate-300 text-center rounded-lg mt-2" placeholder="******" />
           <p className={`mt-2 text-red-600 ${errorMessage ? "visible" : "invisible"}`}>
            {errorMessage}
          </p>
           <button className="mt-6 bg-violet-500 w-[100px] rounded-lg h-[40px]"type="submit">Login</button>
           <p className="mt-4 pt-2">Do not have account? <Link to='/signUp' className="text-blue-800 underline"> Create your account</Link></p>
           <p className="mt-2 ">Want to list  your product? <Link to='/seller/signUp' className="text-blue-800 underline"> Signup as Seller</Link></p>
        </form>
        </div>
        
      </div>
    </>
  );
};

export default LoginPage;