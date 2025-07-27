import { useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "../inputField/InputField";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEye,
  FaEyeSlash,
  FaPhoneSquareAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { BsGenderMale } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import api from "../../api/api";

const SignUp = ({ onSwitchTab, onClose, isModal = false, modalNavigationContext }) => {
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      phone: "",
      gender: "",
    },
    mode: "onTouched",
  });

  const registerHandler = async (data) => {
    setLoader(true);
    try {
      const { data: response } = await api.post("/api/auth/register", data);
      reset();
      if (isModal && onSwitchTab) {
        onSwitchTab("login");
      }
      toast.success("SignedUp Successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoader(false);
    }
  };

  const handleBackNavigation = () => {
    if (isModal && modalNavigationContext?.fromPage == "otplogin" || modalNavigationContext?.fromPage === "resetpassword"  ) {
      // Navigate back to the page user came from
      onSwitchTab(modalNavigationContext.fromPage);
    }else{
      onClose();
    }
  };

  const navigateToLogin = () => {
    if (isModal && onSwitchTab) {
      onSwitchTab("login");
    }
  };

  return (
    <div
      className={` flex items-center justify-center sm:flex ${
        !isModal ? "shadow-2xl shadow-[#000000] rounded-lg" : ""
      }`}
    >
      <form
        onSubmit={handleSubmit(registerHandler)}
        className={`w-full ${
          isModal
            ? "py-3 px-4 sm:py-8 sm:px-8 lg:px-12 overflow-hidden"
            : "py-4 px-4 sm:px-8"
        } rounded-md`}
      >
        {/* Go Back Button - show only when coming from otplogin or resetpassword */}
        {isModal && (
          <div className="flex justify-start -mt-2 -mb-1">
            <button
              type="button"
              onClick={handleBackNavigation}
              className="flex items-center gap-2 text-primary hover:!text-white transition-colors duration-200 text-sm font-medium cursor-pointer"
            >
              <FaArrowLeft className="text-lg" />
             
            </button>
          </div>
        )}
        <div className="flex justify-around mb-4">
          <h1
            className="text-center font-serif text-primary font-bold lg:text-2xl text-xl cursor-pointer"
            onClick={navigateToLogin}
          >
            Login
          </h1>
          <h1
            className="text-center px-2 text-primary font-bold lg:text-2xl text-xl cursor-pointer relative
                after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-white after:via-primary after:to-orange-500 after:rounded-full after:-mb-1"
          >
            SignUp
          </h1>
        </div>
        <hr className="mt-2 mb-5 border-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="text-center flex items-center justify-center py-1 max-sm:py-0.5 sm:py-2">
          <div className="flex flex-col items-center justify-center max-w-md">
            <span className="text-md max-sm:text-lg sm:text-xl lg:text-2xl font-bold">
              Become Member
            </span>
            <p className="text-md max-sm:text-md sm:text-md lg:text-base px-2">
              Get access to exclusive discounts and food combos when you sign in
              / sign up and book your tickets.
            </p>
          </div>
        </div>
        <div className="flex flex-col text-white gap-0.5 max-sm:gap-0 sm:gap-1 lg:gap-2 px-3">
          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-0.5 mt-2 sm:mt-0.5 max-sm:gap-0 sm:gap-1 lg:gap-2 xl:gap-3 relative ${
              errors.username?.message || errors.email?.message ? "sm:mb-6" : ""
            }`}
          >
            <div className="w-full sm:flex-1 ">
              <div className="flex items-center gap-2">
                <FaUser className="text-red-200 text-xl opacity-[0.5]" />
                <label
                  htmlFor="username"
                  className="text-gray-50 font-semibold text-sm sm:text-base"
                >
                  Full Name
                </label>
              </div>
              <InputField
                id="username"
                type="text"
                message="*Name required"
                placeholder="Full Name"
                register={register}
                errors={errors}
                className={" mb-1 "}
                showError={true}
                mobileShowError={true}
                required={true}
              />
            </div>

            <div className="w-full sm:flex-1">
              <div className="flex items-center gap-2">
                <MdEmail className="text-red-200 text-xl opacity-[0.5]" />
                <label
                  htmlFor="email"
                  className="text-gray-50 font-semibold text-sm sm:text-base"
                >
                  Email
                </label>
              </div>
              <InputField
                id="email"
                type="email"
                message="*Email required"
                placeholder="Email"
                register={register}
                errors={errors}
                showError={true}
                mobileShowError={true}
                required={true}
              />
            </div>

            {/* Row-level error display - only on sm+ screens */}
            {(errors.username?.message || errors.email?.message) && (
              <div className="absolute -bottom-5 left-0 right-0 sm:flex gap-3 hidden">
                <div className="flex-1 min-w-0">
                  {errors.username?.message && (
                    <p className="text-xs font-semibold text-red-600 px-2 py-1 rounded truncate">
                      {errors.username.message}*
                    </p>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {errors.email?.message && (
                    <p className="text-xs font-semibold text-red-600  px-2 py-1 rounded truncate">
                      {errors.email.message}*
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-0.5 max-sm:gap-0 sm:gap-1 lg:gap-2 xl:gap-3 relative ${
              errors.phone?.message || errors.password?.message ? "sm:mb-6" : ""
            }`}
          >
            <div className="w-full sm:flex-1 mt-1">
              <div className="flex items-center gap-2">
                <FaPhoneSquareAlt className="text-red-200 text-xl opacity-[0.5]" />
                <label
                  htmlFor="phone"
                  className="text-gray-50 font-semibold text-sm sm:text-base"
                >
                  Mobile number
                </label>
              </div>
              <InputField
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
                required={true}
              />
            </div>
            <div className="w-full sm:flex-1 ">
              <div className="flex items-center gap-2">
                <RiLockPasswordFill className="text-red-200 text-xl opacity-[0.5] " />
                <label
                  htmlFor="password"
                  className="text-gray-50 font-semibold text-sm sm:text-base"
                >
                  Password
                </label>
              </div>
              <div className="relative w-full">
                <InputField
                  id="password"
                  type={`${showPassword ? "text" : "password"}`}
                  message="*Password required"
                  placeholder="Password"
                  register={register}
                  min={6}
                  errors={errors}
                  showError={true}
                  mobileShowError={true}
                  required={true}
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
                <div className="flex-1 min-w-0">
                  {errors.phone?.message && (
                    <p className="text-xs font-semibold text-red-600 px-2 py-1 rounded truncate">
                      {errors.phone.message}*
                    </p>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {errors.password?.message && (
                    <p className="text-xs font-semibold text-red-600 0 px-2 py-1 rounded truncate">
                      {errors.password.message}*
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-full sm:max-w-xs mt-2 mb-0.5">
            <div className="flex items-center gap-2 ">
              <BsGenderMale className="text-red-200 text-xl opacity-[0.5] " />
              <label
                htmlFor="gender"
                className="text-gray-50 font-semibold text-sm sm:text-base"
              >
                Gender
              </label>
            </div>
            <div className="relative max-w-[75%]">
              <select
                id="gender"
                name="gender"
                className="mt-1 block w-full  pl-3 pr-12 rounded-full border border-gray-300 text-gray-50 bg-gray-900 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-blue-500 appearance-none"
                {...register("gender", {
                  required: { value: true, message: "*Gender required" },
                })}
              >
                <option value="" className="bg-gray-900 text-gray-50">
                  Select Your Gender
                </option>
                <option value="male" className="bg-gray-900 text-gray-50">
                  MALE
                </option>
                <option value="female" className="bg-gray-900 text-gray-50">
                  FEMALE
                </option>
                <option value="other" className="bg-gray-900 text-gray-50">
                  OTHER
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
            {errors.gender && (
              <p className="text-xs font-semibold text-red-600 px-2 py-1 rounded mt-1">
                {errors.gender.message}*
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-1 max-sm:mt-2.5 sm:mt-2.5 lg:mt-4">
          <button
            disabled={loader}
            type="submit"
            className="font-semibold text-white bg-gradient-to-bl from-primary to bg-red-600 sm:w-[35%] w-[60%] py-2 rounded-full  hover:border hover:border-primary hover:bg-black transition-colors duration-100 my-3 cursor-pointer"
          >
            {loader ? "Loading..." : "SignUp"}
          </button>
        </div>{" "}
      </form>
    </div>
  );
};

export default SignUp;
