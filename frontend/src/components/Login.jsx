import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import mitrabanner from '../assets/mitraMandal_banner.png'
import '../app.css'
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";


const Login = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const user = useSelector(store => store.auth.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const LoginHandler = async (e) => {
    
    e.preventDefault();
    // api call
    try {
        setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        // it will clear the input fields after successful Login
        setInput({ email: "", password: "" });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if(user){
      navigate('/')
    }
  },[])

  return (

      <div className="login-container">
        <div className="carbg min-sm:visible max-md:hidden">
                <div className='car'>
                   
                      <img src={mitrabanner} height="423px" width="241px" alt="" />
                    
                </div>
        </div>
        <div >
        <form
          onSubmit={LoginHandler}
          className="shadow-lg flex flex-col gap-5 p-7 font-mono"
        >
          <div className="login-card"> 
          <h1 className="text-3xl font-bold text-center ">MitraMandal</h1>
          <h1> Proudly Indian </h1>
          <br />
          <div>
            <span className="font-medium">Email</span>
            <Input
              type="text"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              className="focus-visible:ring-transparent my-2"
            />
          </div>
          <div>
            <span className="font-medium">Password</span>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              className="focus-visible:ring-transparent my-2"
            />
          </div>
          {
              loading ? (
                  <Button>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                  </Button>
              ) : (
                  <Button type="submit">Login</Button>
              )
          }
          </div>
          <div className="bottom-card">
          <span className="text-center">
              Don't have an account? <Link to="/signup" className="text-blue-600">Signup</Link>
          </span>
          
          </div>
        </form>
        </div>
      </div>
      


  );
};

export default Login;
