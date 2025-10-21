import { Button } from "./Button";
import { ButtonLoader } from "./loaders/ButtonLoader";

export const ConfirmDialog = ({
  loading,
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;
  console.log(loading.confirmText);

  return (
    <div className="fixed inset-0 z-50 bg-black/10 backdrop-filter flex items-center justify-center">
      <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 max-w-[300px] text-white shadow-lg">
        <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
        <p className="text-sm text-gray-300 mb-6 text-center">{description}</p>

        <div className="flex justify-between space-x-3">
          <Button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-gray-300 hover:bg-gray-700 transition"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-900 text-gray-300 hover:bg-gray-700 transition"
            disabled={loading[confirmText]}
          >
            {loading[confirmText] ? (
              <ButtonLoader text={`${confirmText}ing`} />
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
