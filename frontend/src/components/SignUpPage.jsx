import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SignUpPage = () => {
    const [firstName,setFirstName]=useState('');
    const [lastName,setLastName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [errorMessage,setErrorMessage]=useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/user/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                })
            });
    
            // ✅ Check if response is OK before parsing JSON
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Signup failed:", errorData);
                toast.success("You Signed Up Successfully");
                setErrorMessage(errorData.errors?.map(err => err.msg).join(". ") || "Signup failed. Please try again.");
                return;
            }
    
            // ✅ Parse JSON after checking status
            const data = await response.json();
            console.log("Response:", data);
    
            // ✅ Reset form fields and show success message
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setErrorMessage('');
            alert("Signup successful!");
    
        } catch (error) {
            console.error("Network error:", error);
            setErrorMessage("Network error. Check if backend is running.");
        }
    };
    
  return (
    <>
      <div className=" flex flex-col h-[75vh] w-screen flex flex-col items-center justify-center bg-gradient-to-r from-violet-500 to-fuchsia-500">
        <div className="flex flex-col bg-neutral-50 w-[25vw] h-[65vh] items-center rounded-2xl">
        <p className="mt-4 pt-4 font-mono font-bold text-sky-600 text-2xl	 ">Create your account here</p>
        <form action="" onSubmit={handleSubmit}className="flex flex-col h-[30vh] mt-6 items-center ml-0 ">
           <label htmlFor="FirstName" className="items-left">First Name</label>
           <input type="text"  name="FirstName" minLength={3} value={firstName} onChange={(e)=>{setFirstName(e.target.value)}} className="w-[175px] bg-slate-300 text-center rounded-lg mt-2"placeholder="FirstName" />
           <label htmlFor="LastName" className="items-left">Last Name</label>
           <input type="text"  name="LastName" value={lastName} onChange={(e)=>{setLastName(e.target.value)}} className="w-[175px] bg-slate-300 text-center rounded-lg mt-2"placeholder="LastName" />
           <label htmlFor="email" className="items-left">Email</label>
           <input type="email"  name="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} className="w-[175px] bg-slate-300 text-center rounded-lg mt-2"placeholder="xyz@gmail.com" />
           <label htmlFor="password" className="mt-2 pt-2">Password </label>
           <input type="password" name="password"  value={password} minLength={8} onChange={(e)=>{setPassword(e.target.value)}}className="w-[175px] bg-slate-300 text-center rounded-lg mt-2" placeholder="******" />
           <p className={`mt-2 text-red-600 ${errorMessage ? "visible" : "invisible"}`}>
            {errorMessage}
          </p>
           <button className="mt-6 bg-violet-500 w-[100px] rounded-lg h-[40px]"type="submit">SignUp</button>
           <p className="mt-4 pt-2">Already have account? <Link to='/login' className="text-blue-800 underline"> Login here</Link></p>
        </form>
        </div>
        
      </div>
    </>
  );
};

export default SignUpPage;