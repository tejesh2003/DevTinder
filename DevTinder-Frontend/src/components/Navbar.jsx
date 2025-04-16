import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unseenCount = useSelector((store) => store.unseen);

  const handleLogout = () => {
    Cookies.remove("token");
    dispatch(removeUser(null));
    return navigate("/login");
  };

  const handleClickFeed = () => {
    if (user) {
      navigate("/");
    }
  };

  const handleClickMessages = () => {
    if (user) {
      navigate("/chats");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-base-100 shadow-md">
      <div className="navbar bg-base-300 shadow-sm">
        <div className="flex-1">
          <button onClick={handleClickFeed} className="btn btn-ghost text-xl">
            😎 DevTinder
          </button>
        </div>
        <div className="flex gap-2 items-center">
          {user && (
            <button
              onClick={handleClickMessages}
              className="btn btn-ghost btn-circle text-xl relative"
              title="Messages"
            >
              {/* Correct Mail Icon from HeroIcons */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.25 6.75L12 13.5l9.75-6.75M21 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2z"
                />
              </svg>

              {/* Conditionally render unseen count */}
              {unseenCount.unseen > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unseenCount.unseen}
                </span>
              )}
            </button>
          )}

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
                        document.activeElement.blur();
                        return navigate("/profile");
                      }}
                    >
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        document.activeElement.blur();
                        return navigate("/connections");
                      }}
                    >
                      Connections
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        document.activeElement.blur();
                        return navigate("/requests");
                      }}
                    >
                      Requests
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
