import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
export const ProfileMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      )
        setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <div
        ref={avatarRef}
        className="w-10 h-10 flex items-center justify-center rounded-full
        bg-gradient-to-br from-cyan-800 to-slate-900
        text-blue-200 font-bold text-lg
        shadow-md hover:shadow-xl transition-all duration-300
        transform hover:scale-110 cursor-pointer
        ring-4 ring-cyan-300/60"
        title={user.name}
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.name.charAt(0).toUpperCase()}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-5 mt-2 w-60 bg-green-50 shadow-xl rounded-lg z-50 py-4 px-4"
        >
          {/* User Info + Update Profile Link */}
          <div className="flex items-center gap-3 mb-3">
            {/* User Initial as Avatar */}
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-200 font-bold text-lg ring-4 ring-cyan-500/40">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-semibold text-gray-800 truncate"
                title={user.name}
              >
                {user.name}
              </p>
              <button
                onClick={() => {
                  navigate("/updateProfile");
                }}
                className="text-xs text-blue-600 cursor-pointer hover:underline mt-1"
              >
                Update Profile
              </button>
              <button
                onClick={() => {
                  navigate("/updateProfile");
                }}
                className="text-xs text-blue-600 cursor-pointer hover:underline mt-1"
              >
                Verify Email
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            className="w-full text-left px-3 py-2 rounded-md hover:bg-red-50 text-sm text-red-600 transition"
            onClick={() => onLogout()}
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};
