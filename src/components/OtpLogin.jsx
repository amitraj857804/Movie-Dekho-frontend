import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "./inputField/InputField";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, setToken } from "./store/authStore";
import api from "../api/api";
import toast from "react-hot-toast";

function OtpLogin() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [onLogin, setOnLogin] = useState(true);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    setFocus,
    clearErrors,
  } = useForm({
    defaultValues: {
      email: "",
      otp: "",
    },
    mode: "onChange",
  });

  const navigateToSignUp = () => {
    navigate("/SignUp");
    setOnLogin(false);
  };

  const sendOtpHandler = async (data) => {
    
    setLoader(true);
    try {
      
      const response = await api.post("api/auth/initiate-login", {
        email: data.email,
      });
      
      toast.success("OTP sent successfully!");
      setOtpSent(true);
      setTimeout(() => {
        setFocus("otp");
      }, 100);
    } catch (error) {
      
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Try again"
      );
    } finally {
      setLoader(false);
    }
  };

  const verifyOtpHandler = async (data) => {
    console.log("Verifying OTP:", data);
    setLoader(true);
    try {
      const { data: response } = await api.post("api/auth/verify-otp", {
        email: data.email,
        otp: data.otp,
      });
      console.log("OTP Verify Response:", response);

      // Store token using Redux
      if (response.token) {
        dispatch(setToken(response.token));
        toast.success("Login successful!");
        navigate("/"); 
      } else {
        toast.error("Login successful but no token received");
      }
    } catch (error) {
      console.error("OTP Verify Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Invalid OTP. Try again";
      toast.error(errorMessage);
    } finally {
      setLoader(false);
    }
  };

  const resendOtp = async () => {
    const currentEmail = getValues("email");
    if (!currentEmail) {
      toast.error("Email is required");
      return;
    }
    await sendOtpHandler({ email: currentEmail });
  };

  const changeEmail = () => {
    setOtpSent(false);
    reset({ email: getValues("email"), otp: "" });
  };

  const otpHandler = async (data) => {
    const currentValues = getValues();

    // Clear OTP errors if we're in send OTP mode
    if (!otpSent) {
      clearErrors("otp");
    }

    // Use currentValues to ensure we get all values
    const formData = {
      email: currentValues.email || data.email,
      otp: currentValues.otp || data.otp,
    };

    if (!otpSent) {
      // Send OTP
      if (!formData.email) {
        toast.error("Please enter your email address");
        return;
      }
      await sendOtpHandler(formData);
    } else {
      // Verify OTP
      if (!formData.email || !formData.otp) {
        toast.error("Please fill all fields");
        return;
      }
      await verifyOtpHandler(formData);
    }
  };

  return (
    <div className="w-full flex items-center justify-center ">
      <div className="sm:w-[550px] sm:m-4  mt-20 sm:my-28 flex items-center justify-center  sm:flex shadow-2xl shadow-[#000000] rounded-lg ">
        <form
          onSubmit={handleSubmit(otpHandler)}
          className=" w-full py-8 px-4 sm:px-8 rounded-md "
        >
          <div className="flex justify-around mb-4">
            <h1
              className={`text-center px-2 text-primary font-bold lg:text-2xl text-xl cursor-pointer relative
                   ${
                     onLogin
                       ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1  after:bg-gradient-to-r after:from-white after:via-primary after:to-orange-500 after:rounded-full after:-mb-1"
                       : ""
                   } `}
            >
              Login
            </h1>
            <h1
              className="text-center font-serif text-primary font-bold lg:text-2xl text-xl cursor-pointer"
              onClick={navigateToSignUp}
            >
              SignUp
            </h1>
          </div>

          <hr className="mt-2 mb-5 border-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="sm:max-w-lg sm:px-4 text-center flex items-center justify-center py-2">
            <div className=" flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">Login with OTP</span>
              {otpSent && (
                <p className="text-sm text-red-200 mt-2">
                  OTP sent to your email. Please check your inbox.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col  gap-2 justify-center items-center">
            <div
              className={`sm:flex  sm:w-[50%] w-[100%] items-center justify-between gap-3 relative `}
            >
              <div className="flex-1 mt-2">
                <InputField
                  required
                  id="email"
                  type="email"
                  message="Email required"
                  placeholder="Enter your registered e-mail"
                  register={register}
                  errors={errors}
                  className={" mb-1"}
                  readOnly={otpSent}
                  centerMobileError={true}
                />
              </div>
              {otpSent && (
                <button
                  type="button"
                  onClick={changeEmail}
                  className="text-primary text-sm hover:underline ml-2 whitespace-nowrap cursor-pointer"
                >
                  Change Email
                </button>
              )}
            </div>
            {errors.email?.message && (
              <p className="hidden sm:flex relative left-0 right-0 text-xs font-semibold text-red-600  px-2 -mb-1 rounded z-10">
                {errors.email?.message}*
              </p>
            )}
            <div
              className={` sm:w-[50%] w-[100%] items-center justify-between gap-3 relative ${
                otpSent ? "" : "hidden"
              } `}
            >
              <div className="flex-1 mt-2">
                <InputField
                  required={false} 
                  id="otp"
                  type="text"
                  message="Enter otp"
                  placeholder="Enter OTP"
                  register={register}
                  errors={errors}
                  className={" mb-1"}
                  inputmode="numeric"
                />
              </div>
            </div>
            {errors.otp?.message && (
              <p className="hidden sm:flex relative left-0 right-0 text-xs font-semibold text-red-600  px-2 -mb-1  rounded z-10">
                {errors.otp?.message}*
              </p>
            )}

            <div className="flex justify-center w-full gap-3">
              <button
                disabled={loader}
                type="submit"
                className="font-semibold text-white bg-gradient-to-bl from-primary to bg-red-600 sm:w-[35%] w-[50%] py-2 rounded-full  hover:border hover:border-primary hover:bg-black transition-colors duration-100 my-3 cursor-pointer"
              >
                {loader ? "Loading..." : otpSent ? "Verify OTP" : "Send OTP"}
              </button>

              {otpSent && (
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={loader}
                  className="font-semibold text-primary border border-primary bg-transparent sm:w-[35%] w-[40%] py-2 rounded-full hover:bg-primary hover:text-white transition-colors duration-200 my-3 cursor-pointer"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OtpLogin;
