export const StepButton = ({ s, step, setStep }) => {
  const isActive = step === s.id;
  const isCompleted = step > s.id;
  const isFuture = step < s.id;

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => {
          if (isCompleted) setStep(s.id);
        }}
        disabled={isFuture}
        aria-current={isActive ? "step" : undefined}
        aria-disabled={isFuture}
        className={`
          w-10 h-10 rounded-full border-2 mb-1 
          focus:outline-none focus:ring-2 focus:ring-teal-500
          ${
            isActive
              ? "border-teal-600 bg-teal-600 text-white cursor-default"
              : isCompleted
              ? "border-teal-600 bg-teal-100 text-teal-600 hover:bg-teal-200"
              : "border-gray-300 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        {isCompleted ? "✓" : s.id}
      </button>

      <span
        className={`text-sm font-medium ${
          isActive || isCompleted ? "text-teal-600" : "text-gray-500"
        }`}
      >
        {s.label}
      </span>

      {s.id !== 3 && (
        <div
          className={`h-12 w-px mt-1 ${
            isCompleted ? "bg-teal-600" : "bg-gray-300"
          }`}
        />
      )}
    </div>
  );
};
