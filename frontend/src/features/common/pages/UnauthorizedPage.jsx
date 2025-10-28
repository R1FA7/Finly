import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { BACKGROUND_IMAGE_URL } from "../../../utils/constants";
import { Button } from "../components/Button";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-contain bg-center px-4"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
    >
      <div className="text-center">
        <p className="text-amber-500 shadow-white shadow-2xl font-bold">
          You don’t have permission to view this page. Please contact your
          administrator or try another page.
        </p>
        <h1 className="text-3xl font-bold text-slate-900 text-shadow-lg">
          403 - Access Denied
        </h1>

        <div className="flex justify-center">
          <Button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 hover:text-black transition"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
