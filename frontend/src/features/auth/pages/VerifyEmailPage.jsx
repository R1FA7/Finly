import {
  CheckBadgeIcon,
  EnvelopeIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../../context/AppContext";
import { API_PATHS } from "../../../utils/apiPaths";
import axiosInstance from "../../../utils/axiosInstance";

export const VerifyEmailPage = () => {
  const { user, getUserData } = useContext(AppContext);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("idle");
  const [isVerified, setIsVerified] = useState(user.isAccountVerified);

  useEffect(() => {
    setIsVerified(user.isAccountVerified);
  }, [user.isAccountVerified]);

  const sendOtp = async () => {
    try {
      setStatus("loading");
      const res = await axiosInstance.post(
        API_PATHS.AUTH.ACCOUNT_VERIFICATION_OTP
      );
      console.log(res);
      if (res.data.success) {
        setStatus("sent");
        toast.success(res.data.message || "OTP sent to your email.");
      } else {
        toast.error("Failed");
      }
    } catch (error) {
      setStatus("error");
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP.");
      return;
    }

    try {
      setStatus("loading");
      const res = await axiosInstance.post(API_PATHS.AUTH.VERIFY_ACCOUNT, {
        otp,
      });
      setStatus("success");
      await getUserData();
      setIsVerified(true);
      toast.success(res.data.message || "Email verified successfully.");
    } catch (error) {
      setStatus("error");
      toast.error(error.response?.data?.message || "Invalid OTP.");
    }
  };

  if (isVerified) {
    return (
      <div className="relative w-full mt-16 px-4">
        {/* Rotated container (wraps clips + note) */}
        <div className="relative transform -rotate-3 max-w-md mx-auto">
          {/* Paper clips on top corners */}
          <PaperClipIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 absolute -top-2 -left-4 -rotate-10 z-20" />
          <PaperClipIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 absolute -top-3 -right-4 -rotate-12 z-20" />

          {/* Paper note */}
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-black/40 px-6 py-8 relative z-10">
            <div className="flex flex-col items-center text-center">
              <CheckBadgeIcon className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Email Verified
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your email{" "}
                <span className="text-cyan-700 dark:text-cyan-400 font-medium">
                  {user.email}
                </span>{" "}
                is verified.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl relative border border-gray-200">
      <EnvelopeIcon className="w-14 h-14 absolute -top-7 left-1/2 -translate-x-1/2 bg-cyan-800 text-white rounded-full p-3 shadow-lg ring-4 ring-white" />

      <h2 className="text-3xl font-extrabold mb-4 text-center text-gray-900 dark:text-white">
        Verify your Email
      </h2>

      <p className="mb-2 text-center text-gray-700 dark:text-gray-200">
        We need to verify your email address to activate your account.
      </p>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
        Email:{" "}
        <strong className="text-cyan-700 dark:text-cyan-600">
          {user.email}
        </strong>
      </p>

      {status !== "sent" && (
        <button
          onClick={sendOtp}
          disabled={status === "loading"}
          className="mb-6 w-full px-6 py-3 bg-cyan-700 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {status === "loading" ? "Sending OTP..." : "Send Verification OTP"}
        </button>
      )}

      {status === "sent" && (
        <div className="mt-4">
          <label
            htmlFor="otp-input"
            className="block mb-3 text-center text-gray-700 font-medium dark:text-gray-100"
          >
            Enter the 6-digit OTP
          </label>
          <input
            id="otp-input"
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="mx-auto block w-40 p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-600 text-center text-lg font-mono tracking-widest dark:text-gray-200"
            placeholder="------"
          />

          <button
            onClick={handleVerify}
            disabled={status === "loading"}
            className="w-full px-6 py-3 bg-cyan-700 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {status === "loading" ? "Verifying..." : "Verify Email"}
          </button>
        </div>
      )}
    </div>
  );
};
