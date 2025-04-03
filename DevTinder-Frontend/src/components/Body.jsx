import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fetchUser = async()=>{
        try{
            const response = await axios.get(BASE_URL+"/profile/view",{
                withCredentials:true
            })
            dispatch(addUser(response.data))
        }catch(err){
            console.log(err);
            return navigate("/login")
        }
    }

    useEffect(()=>{
        fetchUser();
    },[])

  return (
    <div>
        <Navbar />
        <Outlet />
    </div>
  )
};

export default Body;