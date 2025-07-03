import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "./inputField/inputField";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaUser, FaEye, FaEyeSlash, FaPhoneSquareAlt } from "react-icons/fa";
import { BsGenderMale } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

const SignUp = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const registerHandler = async (data) => {
    const url = "http://localhost:8080/api/auth/register";
  

   const {data: response} = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify(data), // Convert the data object to a JSON string
    })
      
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the JSON from the response
      
      
  };
  return (
    <div className="sm:w-[700px] sm:m-4  mt-20 sm:my-28 flex items-center justify-center  sm:flex shadow-2xl shadow-[#000000] rounded-lg ">
      <form
        onSubmit={handleSubmit(registerHandler)}
        className="  w-fit py-8 px-4 sm:px-8 rounded-md"
      >
        <h1 className="text-center font-serif text-primary font-bold lg:text-2xl text-xl">
          SignUp
        </h1>

        <hr className="mt-2 mb-5" />

        <div className="flex flex-col text-white gap-2">
          <div className="sm:flex items-center justify-between gap-3">
            <div>
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
                message="*Name is required"
                placeholder="Full Name"
                register={register}
                errors={errors}
                className={"text-white mb-1"}
              />
            </div>

            <div>
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
                message="*Email is required"
                placeholder="Email"
                register={register}
                errors={errors}
                className={"text-white"}
              />
            </div>
          </div>
          <div className="sm:flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <FaPhoneSquareAlt className="text-red-200 text-xl opacity-[0.5]" />
                <label htmlFor="email" className="text-gray-50 font-semibold">
                  Mobile number
                </label>
              </div>
              <InputField
                required
                id="phone"
                type="text"
                message="*Mobile number is required"
                placeholder="Mobile number"
                max={10}
                register={register}
                errors={errors}
                inputmode="numeric"
                className={"text-white mb-1"}
              />
            </div>
            <div>
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
                  message="*Password is required"
                  placeholder="Password"
                  register={register}
                  min={6}
                  errors={errors}
                  className={"text-white "}
                />
                <div
                  className="absolute right-3 top-3.5 cursor-pointer text-red-200 opacity-[0.5]"
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
          </div>

          <div className="sm:max-w-1/2">
            <div className="flex items-center gap-2 ">
              <BsGenderMale className="text-red-200 text-xl opacity-[0.5] " />
              <label htmlFor="gender" className="text-gray-50 font-semibold">
                Gender
              </label>
            </div>
            <select
              id="gender"
              name="gender"
              required
              className="mt-1 block w-full pr-8 rounded-md border border-gray-300 text-gray-50 bg-gray-900  bg- px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-blue-500"
              {...register("gender")}
            >
              <option value="">Select Your Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            disabled={loader}
            type="submit"
            className="bg-customRed font-semibold text-white  bg-gradient-to-bl from-primary to bg-red-600   w-[50%] py-2 rounded-full hover:text-slate-400 transition-colors duration-100 my-3"
          >
            {loader ? "Loading..." : "SignUp"}
          </button>
        </div>

        <p className="text-center text-sm text-slate-300 mt-4 ">
          Already have an account?{" "}
          <Link className="font-semibold underline " to="/login">
            <span className="text-primary font-bold hover:text-primary-dull ">
              {" "}
              Login
            </span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
