import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "./inputField/InputField";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearPreviousPage, selectPreviousPage, selectNavigationContext, clearNavigationContext, setNavigationContext } from "./store/authStore";
import { useNavigationContext } from "../hooks/useNavigationContext";
import toast from "react-hot-toast";
import { FaUser, FaEye, FaEyeSlash, FaPhoneSquareAlt, FaArrowLeft } from "react-icons/fa";
import { BsGenderMale } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import api from "../api/api";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const previousPage = useSelector(selectPreviousPage);
  const navigationContext = useSelector(selectNavigationContext);
  const { goBack: handleGoBack, getBackButtonText } = useNavigationContext();
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [onSignup, setOnsignUp] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      phone: "",
    },
    mode: "onTouched",
  });

  // Handle direct navigation to signup page
  useEffect(() => {
    // If no navigation context is set, this is a direct entry
    if (!navigationContext.fromPage) {
      dispatch(setNavigationContext({
        fromPage: null,
        pageState: null,
        isDirectEntry: true
      }));
    }
  }, [navigationContext.fromPage, dispatch]);

  const registerHandler = async (data) => {
    setLoader(true);
    try {
      const { data: response } = await api.post("/api/auth/register", data);
      
      reset();
      navigate("/login");
      toast.success("SignedUp Successful!y!");
    } catch (error) {
      console.error("signup error:", error.response.data);
      toast.error(error.response.data || "Signup failed. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  const navigateToLogin = () => {
    navigate("/login");
    setOnsignUp(false);
  };

  return (
    <div className="sm:w-[550px] sm:m-4  mt-20 sm:my-28 flex items-center justify-center  sm:flex shadow-2xl shadow-[#000000] rounded-lg  ">
      <form
        onSubmit={handleSubmit(registerHandler)}
        className="  w-full py-8 px-4 sm:px-8 rounded-md"
      >
        {/* Go Back Button */}
        <div className="flex justify-start mb-2">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-primary hover:text-white transition-colors duration-200 text-sm font-medium cursor-pointer"
          >
            <FaArrowLeft className="text-xs" />
            {getBackButtonText()}
          </button>
        </div>

        <div className="flex justify-around mb-4">
          <h1
            className="text-center font-serif text-primary font-bold lg:text-2xl text-xl cursor-pointer"
            onClick={navigateToLogin}
          >
            Login
          </h1>
          <h1
            className={`text-center px-2 text-primary font-bold lg:text-2xl text-xl cursor-pointer relative
                ${
                  onSignup
                    ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1  after:bg-gradient-to-r after:from-white after:via-primary after:to-orange-500 after:rounded-full after:-mb-1"
                    : ""
                } `}
          >
            SignUp
          </h1>
        </div>

        <hr className="mt-2 mb-5 border-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="sm:max-w-lg sm:px-4 text-center flex items-center justify-center py-2">
          <div className=" flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">Become Member</span>
            <p>
              Get access to exclusive discounts and food combos when you sign in
              / sign up and book your tickets.
            </p>
          </div>
        </div>
        <div className="flex flex-col text-white gap-2">
          <div
            className={`sm:flex items-center justify-between gap-3 relative ${
              errors.fullname?.message || errors.email?.message ? "sm:mb-6" : ""
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <FaUser className="text-red-200 text-xl opacity-[0.5]" />
                <label
                  htmlFor="username"
                  className="text-gray-50 font-semibold"
                >
                  Full Name
                </label>
              </div>
              <InputField
                required
                id="fullname"
                type="text"
                message="*Name required"
                placeholder="Full Name"
                register={register}
                errors={errors}
                className={" mb-1"}
                showError={true}
                mobileShowError={true}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <MdEmail className="text-red-200 text-xl opacity-[0.5]" />
                <label htmlFor="email" className="text-gray-50 font-semibold">
                  Email
                </label>
              </div>
              <InputField
                required
                id="email"
                type="email"
                message="*Email required"
                placeholder="Email"
                register={register}
                errors={errors}
                showError={true}
                mobileShowError={true}
              />
            </div>

            {/* Row-level error display - only on sm+ screens */}
            {(errors.fullname?.message || errors.email?.message) && (
              <div className="absolute -bottom-5 left-0 right-0 sm:flex gap-3 hidden">
                <div className="flex-1">
                  {errors.fullname?.message && (
                    <p className="text-xs font-semibold text-red-600 px-2 py-1 rounded">
                      {errors.fullname.message}*
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  {errors.email?.message && (
                    <p className="text-xs font-semibold text-red-600  px-2 py-1 rounded">
                      {errors.email.message}*
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className={`sm:flex items-center justify-between gap-3 relative ${
              errors.phone?.message || errors.password?.message ? "sm:mb-6" : ""
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <FaPhoneSquareAlt className="text-red-200 text-xl opacity-[0.5]" />
                <label htmlFor="phone" className="text-gray-50 font-semibold">
                  Mobile number
                </label>
              </div>
              <InputField
                required
                id="phone"
                type="text"
                message="*Mobile number required"
                placeholder="Mobile number"
                max={10}
                register={register}
                errors={errors}
                inputmode="numeric"
                className={" mb-1"}
                showError={true}
                mobileShowError={true}
              />
            </div>
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
              <div className="relative w-full">
                <InputField
                  required
                  id="password"
                  type={`${showPassword ? "text" : "password"}`}
                  message="*Password required"
                  placeholder="Password"
                  register={register}
                  min={6}
                  errors={errors}
                  showError={true}
                  mobileShowError={true}
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
            </div>

            {/* Row-level error display - only on sm+ screens */}
            {(errors.phone?.message || errors.password?.message) && (
              <div className="absolute -bottom-5 left-0 right-0 sm:flex gap-3 hidden">
                <div className="flex-1">
                  {errors.phone?.message && (
                    <p className="text-xs font-semibold text-red-600 px-2 py-1 rounded">
                      {errors.phone.message}*
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  {errors.password?.message && (
                    <p className="text-xs font-semibold text-red-600 0 px-2 py-1 rounded">
                      {errors.password.message}*
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="sm:max-w-1/2">
            <div className="flex items-center gap-2 ">
              <BsGenderMale className="text-red-200 text-xl opacity-[0.5] " />
              <label htmlFor="gender" className="text-gray-50 font-semibold">
                Gender
              </label>
            </div>
            <div className="relative">
              <select
                id="gender"
                name="gender"
                required
                className="mt-1 block w-full pl-3 pr-12 rounded-full border border-gray-300 text-gray-50 bg-gray-900 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-blue-500 appearance-none"
                {...register("gender")}
              >
                <option value="" className="bg-gray-900 text-gray-50">
                  Select Your Gender
                </option>
                <option value="male" className="bg-gray-900 text-gray-50">
                  Male
                </option>
                <option value="female" className="bg-gray-900 text-gray-50">
                  Female
                </option>
                <option value="other" className="bg-gray-900 text-gray-50">
                  Other
                </option>
              </select>

              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            disabled={loader}
            type="submit"
            className="bg-customRed font-semibold text-white  bg-gradient-to-bl from-primary to bg-red-600 sm:w-[35%]  hover:border hover:border-primary hover:bg-black   w-[50%] py-2 rounded-full  transition-colors duration-100 my-3 cursor-pointer"
          >
            {loader ? "Loading..." : "SignUp"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
