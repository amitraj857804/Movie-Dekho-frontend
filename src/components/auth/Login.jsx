import React, { useEffect, useState } from "react";
import InputField from "../inputField/InputField";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser, FaEye, FaEyeSlash} from "react-icons/fa";
import api from "../../api/api";
import { useSelector,useDispatch } from "react-redux";
import { setToken, selectToken } from "../store/authStore";
import { FaArrowLeft } from "react-icons/fa";

function Login({ onSwitchTab, onClose, isModal = false,}) {
  
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [onLogin, setOnLogin] = useState(true);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (token) {
      if (isModal && onClose) {
        onClose();
      } else {
        navigate("/");
      }
    }
  }, [token, isModal, onClose]);


  const loginHandler = async (data) => {
    setLoader(true);
    try {
      
      const { data: response } = await api.post("/api/auth/login", data);

      dispatch(setToken(response.token));
      reset();
      toast.success(" Login Successful!");
    } catch (error) {
      
      toast.error(error.response.data || "Login failed. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  const navigateToResetPassword = () => {
    if (isModal && onSwitchTab) {
      onSwitchTab('resetpassword');
    } 
  };

  const navigateToOtpLogin = () => {
    if (isModal && onSwitchTab) {
      onSwitchTab('otplogin');
    } 
  };

  const navigateToSignUp = () => {
    if (isModal && onSwitchTab) {
      onSwitchTab('signup');
    } 
  };
  return (
    <div className={`${isModal ? 'w-full overflow-hidden' : 'sm:w-[550px] sm:m-4 mt-20 sm:my-28'} flex items-center justify-center sm:flex ${!isModal ? 'shadow-2xl shadow-[#000000] rounded-lg' : ''}`}>
      <form
        onSubmit={handleSubmit(loginHandler)}
        className={`w-full ${isModal ? 'py-6 px-4 sm:py-8 sm:px-8 lg:px-12 overflow-hidden' : 'py-8 px-4 sm:px-8'} rounded-md`}
      >
         {/* Go Back Button */}
                  <div className="flex justify-start -mt-2 -mb-1">
                    <button
                      type="button"
                      onClick={ () => onClose() }
                      className="flex items-center gap-2 text-primary hover:!text-white transition-colors duration-200 text-sm font-medium cursor-pointer"
                    >
                      <FaArrowLeft className="text-lg" />
                   
                    </button>
                  </div>
      
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
            <span className="text-2xl font-bold">
              Login to access exclusive offers
            </span>
            <p>
              Get access to exclusive discounts and food combos when you sign
              in/ sign up and book your tickets.
            </p>
          </div>
        </div>

        <div className="flex flex-col  gap-2 justify-center items-center">
          <div
            className={`sm:flex  sm:w-[70%] w-[90%] items-center justify-between gap-3 relative ${
              errors.fullname?.message ? "sm:mb-6" : ""
            }`}
          >
            <div className="flex-1 mt-2">
              <div className="flex items-center gap-2">
                <FaUser className="text-red-200 text-xl opacity-[0.5]" />
                <label
                  htmlFor="fullname"
                  className="text-gray-50 font-semibold"
                >
                  Email/Mobile No
                </label>
              </div>
              <InputField
                required
                id="username"
                type="text"
                message="*Email or Mobile Number is required"
                placeholder="Email or Mobile Number"
                register={register}
                errors={errors}
                className={" mb-1"}
              />
              {errors.username?.message && (
                <p className="hidden sm:flex relative left-0 right-0 text-xs font-semibold text-red-600  px-2 -mb-1 rounded z-10">
                  {errors.username?.message}*
                </p>
              )}
            </div>
          </div>
          <div
            className={`sm:flex sm:w-[70%] w-[90%]  items-center justify-center gap-3 relative ${
              errors.password?.message ? "sm:mb-6" : ""
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <RiLockPasswordFill className="text-red-200 text-xl opacity-[0.5] " />
                <label
                  htmlFor="password"
                  className="text-gray-50 font-semibold"
                >
                  Password
                </label>
              </div>
              <div className="relative w-full ">
                <InputField
                  required
                  id="password"
                  type={`${showPassword ? "text" : "password"}`}
                  message="*Password is required"
                  placeholder="Password"
                  register={register}
                  min={6}
                  errors={errors}
                />
                <div
                  className="absolute right-3 top-3.5 cursor-pointer text-red-400 opacity-[0.5]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-xl" />
                  ) : (
                    <FaEye className="text-xl" />
                  )}
                </div>
              </div>
              {errors.password?.message && (
                <p className="hidden sm:flex relative left-0 right-0 text-xs font-semibold text-red-600 py-1  px-2 -mb-9 rounded z-10">
                  {errors.password?.message}*
                </p>
              )}
            </div>
          </div>
        </div>
        <div 
          className="text-center mt-3 opacity-[0.5] cursor-pointer hover:opacity-[0.8] transition-opacity"
          onClick={navigateToResetPassword}
        >
          Forgot Password?
        </div>
        <div className="flex justify-center ">
          <button
            disabled={loader}
            type="submit"
            className="  font-semibold text-white  bg-gradient-to-bl from-primary to bg-red-600  hover:border hover:border-primary hover:bg-black   sm:w-[40%] w-[60%] py-2 rounded-full transition-colors duration-100 my-3 cursor-pointer"
          >
            {loader ? "Loading..." : "Login"}
          </button>
        </div>
        <div
          className="text-center cursor-pointer opacity-[0.5]"
          onClick={navigateToOtpLogin}
        >
          Login with OTP
        </div>
      </form>
    </div>
  );
}

export default Login;
