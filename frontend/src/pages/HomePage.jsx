import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { AppContext } from "../context/AppContext";

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
      <h3 className="text-lg text-gray-700 max-w-xl mb-2">
        Hey {user ? String(user.name).toUpperCase() : "there"}
      </h3>
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
        Welcome to Finly
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-2">
        Smarter financial tracking. Spend smart. Save smarter.
      </p>
      <Button onClick={() => navigate("/dashboard")}>Get Started</Button>
    </div>
  );
};
