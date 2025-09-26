export const PasswordResetStepCard = ({
  stepId,
  currentStep,
  title,
  children,
}) => {
  const status =
    currentStep === stepId
      ? "border-teal-600 bg-white dark:bg-gray-900"
      : currentStep > stepId
      ? "border-teal-600 bg-teal-50 opacity-70"
      : "border-gray-300 bg-gray-50 dark:bg-gray-600 opacity-60";
  return (
    <div className={`p-6 border rounded-md shadow-md ${status}`}>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 dark:text-gray-100">
        {currentStep > stepId ? "✓" : `${stepId}.`} {title}
      </h2>
      {children}
    </div>
  );
};
