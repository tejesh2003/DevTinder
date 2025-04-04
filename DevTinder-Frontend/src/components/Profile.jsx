import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((store) => store.user);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card bg-base-100 w-96 shadow-md">
        <figure>
          <img
            src={
              user.photoUrl ||
              "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            }
            alt="Profile"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{user.firstName + " " + user.lastName}</h2>

          {user.about && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">About</h3>
              <p className="text-sm text-gray-600">{user.about}</p>
            </div>
          )}

          {user.skills && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Skills</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {user.skills?.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))
                ) : (
                  <></>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
