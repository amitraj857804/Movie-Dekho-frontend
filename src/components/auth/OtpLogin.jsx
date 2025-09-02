import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import InputField from "../inputField/InputField";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../store/authSlice";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../api/api";
import toast from "react-hot-toast";

function OtpLogin({ onSwitchTab, onClose, isModal = false }) {
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [onLogin, setOnLogin] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const intervalRef = useRef(null);
  const dispatch = useDispatch();

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

  // Timer logic for OTP resend - Most efficient version
  useEffect(() => {
    if (resendTimer > 0 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setResendTimer((timer) => {
          if (timer <= 1) {
            setCanResend(true);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }

    // Cleanup when component unmounts or timer should stop
    if (resendTimer === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [resendTimer]);

  const startResendTimer = (seconds) => {
    setCanResend(false);
    setResendTimer(seconds);
  };

  const navigateToSignUp = () => {
    if (isModal && onSwitchTab) {
      onSwitchTab("signup", { fromPage: "otplogin" });
    }
  };

const sendOtpHandler = async (data) => {
    setLoader(true);
    try {
      // Determine if the input is email or phone number
      const inputValue = data.text.trim();
      const isEmail = inputValue.includes("@");

      const payload = isEmail
        ? { email: inputValue }
        : { phoneNumber: inputValue };

      const response = await api.post("api/auth/initiate-login", payload);

      toast.success("OTP sent successfully!");
      setOtpSent(true);
      startResendTimer(30);
      setTimeout(() => {
        setFocus("otp");
      }, 100);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data.error ||
        "Failed to send OTP. Please try again.";
        toast.error(errorMessage);
      
    } finally {
      setLoader(false);
    }
  };

  const verifyOtpHandler = async (data) => {
    setLoader(true);
    try {
      const inputValue = data.text.trim();
      const isEmail = inputValue.includes("@");

      const payload = {
        otp: data.otp,
      };

      if (isEmail) {
        payload.email = inputValue;
      } else {
        payload.phoneNumber = inputValue;
      }

      const { data: response } = await api.post("api/auth/verify-otp", payload);

      if (response.token) {
        dispatch(setToken(response.token));
        toast.success("Login successful!");
        if (isModal && onClose) {
          onClose();
        } else {
          navigate("/");
        }
      } else {
        toast.error("Login successful but no token received");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data.error ||
        "Invalid OTP. Try again";
      toast.error(errorMessage);
    } finally {
      setLoader(false);
    }
  };

  const resendOtp = async () => {
    const currentText = getValues("text");
    if (!currentText) {
      toast.error("Email/mobile required");
      return;
    }
    await sendOtpHandler({ text: currentText });
  };

  const changeEmail = () => {
    setOtpSent(false);
    setCanResend(true);
    setResendTimer(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
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
      text: currentValues.text || data.text,
      otp: currentValues.otp || data.otp,
    };

    if (!otpSent) {
      // Send OTP
      if (!formData.text) {
        toast.error("Please enter your email/mobiie");
        return;
      }
      await sendOtpHandler(formData);
    } else {
      // Verify OTP
      if (!formData.text || !formData.otp) {
        toast.error("Please fill all fields");
        return;
      }
      await verifyOtpHandler(formData);
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-w-[400px]">
      <div
        className={`${
          isModal
            ? "w-full overflow-hidden"
            : "sm:w-[550px] sm:m-4 mt-20 sm:my-28"
        } flex items-center justify-center sm:flex ${
          !isModal ? "shadow-2xl shadow-[#000000] rounded-lg" : ""
        }`}
      >
        <form
          onSubmit={handleSubmit(otpHandler)}
          className={`w-full ${
            isModal
              ? "py-6 px-4 sm:py-8 sm:px-8 lg:px-12 overflow-hidden"
              : "py-8 px-4 sm:px-8"
          } rounded-md`}
        >
          {/* Go Back Button */}
          <div className="flex justify-start -mt-2 -mb-1 ">
            <button
              type="button"
              onClick={() => onSwitchTab("login")}
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
              <span className="text-2xl font-bold">Login with OTP</span>
              <span className="">
                If the email/Mobile no. exits we shall send you an otp
              </span>
              {otpSent && (
                <p className="text-sm text-red-200 mt-2">
                  OTP sent to your email. Please check your inbox.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col  gap-2 justify-center items-center">
            <div
              className={`sm:flex  sm:w-[70%] w-[90%] items-center justify-between gap-2 relative `}
            >
              <div className="flex-1 mt-2">
                <InputField
                  required
                  id="text"
                  type="text"
                  message="Email/phone required"
                  placeholder="Email/mobile no."
                  register={register}
                  errors={errors}
                  className={" mb-1"}
                  readOnly={otpSent}
                  centerMobileError={true}
                />
              </div>
            </div>
            <div className=" sm:w-[70%] w-[90%] pl-1.5 flex items-start justify-self-start">
              {otpSent && (
                <button
                  type="button"
                  onClick={changeEmail}
                  className="text-primary text-sm hover:underline  whitespace-nowrap cursor-pointer"
                >
                  Change Email/Phone
                </button>
              )}
            </div>
            {errors.email?.message && (
              <p className="hidden sm:flex relative left-0 right-0 text-xs font-semibold text-red-600  px-2 -mb-1 rounded z-10">
                {errors.email?.message}*
              </p>
            )}
            <div
              className={`sm:w-[70%] w-[90%]  items-center justify-between gap-3 relative ${
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

            <div className="flex justify-center w-full gap-3 ">
              <button
                disabled={loader}
                type="submit"
                className="font-semibold text-sm text-white flex justify-center bg-gradient-to-bl from-primary to bg-red-600 sm:w-[35%] w-[40%] py-2 rounded-full  hover:border hover:border-primary hover:bg-black transition-colors duration-100 my-3 cursor-pointer"
              >
                {loader
                  ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  : otpSent
                  ? "Verify & Login"
                  : "Send OTP"}
              </button>

              {otpSent && (
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={loader || !canResend}
                  className={`font-semibold text-sm border border-primary sm:w-[32%] w-[40%] py-2 rounded-full transition-colors duration-200 my-3 ${
                    canResend && !loader
                      ? "text-primary bg-transparent hover:bg-primary hover:!text-white cursor-pointer"
                      : "text-gray-500 bg-gray-200 cursor-not-allowed"
                  }`}
                >
                  {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
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
