import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import { PasswordResetStepCard } from "../components/PasswordResetStepCard";
import { StepButton } from "../components/StepButton";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
export const ResetPasswordPage = () => {
  const steps = [
    { id: 1, label: "Insert Email" },
    { id: 2, label: "Verify OTP" },
    { id: 3, label: "Reset Password" },
  ];
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  const handleNext = async () => {
    try {
      if (step === 1) {
        if (!email.trim()) {
          toast.error("Email is required");
          return;
        }

        const res = await axiosInstance.post(API_PATHS.AUTH.SEND_OTP, {
          email,
        });

        if (!res.data.success) {
          toast.error(res.data.message || "Failed to send OTP");
          return;
        }
        console.log(res.data);
        toast.success(res.data.message);
        setStep(2);
      } else if (step === 2) {
        if (!otp.trim()) {
          toast.error("OTP is required");
          return;
        }

        if (otp.trim().length !== 6) {
          toast.error("OTP must be exactly 6 digits");
          return;
        }

        const res = await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, {
          email,
          otp,
        });

        if (!res.data.success) {
          toast.error(res.data.message || "OTP verification failed");
          return;
        }

        toast.success(res.data.message);
        setStep(3);
      } else if (step === 3) {
        if (newPassword.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }

        if (newPassword !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        const res = await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
          email,
          newPassword,
        });

        if (!res.data.success) {
          toast.error(res.data.message || "Failed to reset password");
          return;
        }

        toast.success(res.data.message);
        navigate("/login");
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="py-10 px-4 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-lg p-3">
        <div className="flex items-center gap-3 justify-center mb-6">
          <ArrowPathIcon className="w-8 h-8 text-teal-600" />
          <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Reset Password
          </p>
        </div>
        <div className="flex flex-row gap-8">
          {/* Vertical Steps */}
          <div className="flex flex-col items-center">
            {steps.map((s) => (
              <StepButton key={s.id} s={s} step={step} setStep={setStep} />
            ))}
          </div>
          {/* 3 vertical cards */}
          <div className="flex-1 flex flex-col gap-8">
            <PasswordResetStepCard
              stepId={1}
              currentStep={step}
              title={"Insert your Email"}
            >
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md 
                dark:text-gray-200 focus:outline-none focus:ring-teal-600 focus:ring-2"
                required
                disabled={step > 1}
              />
              {step === 1 && (
                <div className="mt-6 flex justify-end gap-4">
                  <Button onClick={handleNext}>Next</Button>
                </div>
              )}
            </PasswordResetStepCard>
            <PasswordResetStepCard
              stepId={2}
              currentStep={step}
              title={"Insert OTP"}
            >
              <input
                type="text"
                maxLength={6}
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-600 focus:ring-2"
                disabled={step != 2}
                required
              />
              {step === 2 && (
                <div className="mt-6 flex justify-end gap-4">
                  <Button onClick={handleBack}>Back</Button>
                  <Button onClick={handleNext}>Next</Button>
                </div>
              )}
            </PasswordResetStepCard>
            <PasswordResetStepCard
              stepId={3}
              currentStep={step}
              title={"Insert New Password"}
            >
              <input
                type="password"
                placeholder="Password must be atleast 6 characters long."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                disabled={step !== 3}
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                disabled={step !== 3}
                required
              />
              {step === 3 && (
                <div className="mt-6 flex justify-end gap-4">
                  <Button onClick={handleBack}>Back</Button>
                  <Button onClick={handleNext}>Done</Button>
                </div>
              )}
            </PasswordResetStepCard>
          </div>
        </div>
      </div>
    </div>
  );
};
