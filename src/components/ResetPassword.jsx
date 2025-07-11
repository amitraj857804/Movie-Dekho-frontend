// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import InputField from "./inputField/InputField";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { selectToken, setToken } from "./store/authStore";
// import api from "../api/api";
// import toast from "react-hot-toast";


import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "./inputField/InputField";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, setToken, setNavigationContext, selectNavigationContext } from "./store/authStore";
import { useNavigationContext } from "../hooks/useNavigationContext";
import { FaArrowLeft } from "react-icons/fa";
import api from "../api/api";
import toast from "react-hot-toast";


function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigationContext = useSelector(selectNavigationContext);
  const { goBack: handleGoBack, getBackButtonText } = useNavigationContext();

  // Handle direct navigation to reset password page
  useEffect(() => {
    // If no navigation context is set, this is a direct entry
    if (!navigationContext.fromPage) {
      dispatch(setNavigationContext({
        fromPage: 'resetpassword-direct', // Special case: Reset password page should go back to regular login
        pageState: null,
        isDirectEntry: false // We want to go back to login, not home
      }));
    }
  }, [navigationContext.fromPage, dispatch]);

  return (
    <div className="w-full flex items-center justify-center ">
      <div className="sm:w-[550px] sm:m-4  mt-20 sm:my-28 flex items-center justify-center  sm:flex shadow-2xl shadow-[#000000] rounded-lg ">
        <form className=" w-full py-8 px-4 sm:px-8 rounded-md ">
          {/* Go Back Button */}
          <div className="flex justify-start mb-2">
            <button
              type="button"
              onClick={handleGoBack}
              className="flex items-center gap-2 text-primary hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              <FaArrowLeft className="text-xs" />
              {getBackButtonText()}
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Reset Password</h1>
            <p className="text-gray-300">Reset password functionality coming soon...</p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword