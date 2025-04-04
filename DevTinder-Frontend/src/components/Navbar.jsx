import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("token");
    dispatch(removeUser(null));
    return navigate("/login");
  };
  const handleClick = () => {
    if (user) {
      navigate("/");
    }
  };
  return (
    <nav className="sticky top-0 z-50 bg-base-100 shadow-md">
      <div className="navbar bg-base-300 shadow-sm">
        <div className="flex-1">
          <button onClick={handleClick} className="btn btn-ghost text-xl">
            😎 DevTinder
          </button>
        </div>
        <div className="flex gap-2">
          <div className="dropdown dropdown-end mx-5">
            {user && (
              <>
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="user photo"
                      src={
                        user.photoUrl ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <button
                      onClick={() => {
                        return navigate("/profile");
                      }}
                    >
                      Profile
                    </button>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
