import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const [editing, setEditing] = useState(false);

  return (
    <>
      {!editing && (
        <div className="flex items-center justify-center mt-10 p-5">
          <div className="card bg-base-100 w-96 shadow-md">
            <figure>
              <img
                src={
                  user?.photoUrl ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="Profile"
                className="w-full h-64 object-cover"
              />
            </figure>

            <div className="card-body space-y-2 pt-4">
              <h2 className="card-title">
                {user?.firstName + " " + user?.lastName}
              </h2>

              {(user?.age || user?.gender) && (
                <p className="text-sm text-gray-600">
                  {user?.age && `Age: ${user.age}`}{" "}
                  {user?.gender && `| Gender: ${user.gender}`}
                </p>
              )}

              {user?.about && (
                <div>
                  <h3 className="text-sm font-semibold">About</h3>
                  <p className="text-sm text-gray-600">{user.about}</p>
                </div>
              )}

              {user?.skills?.length > 0 && (
                <div className="flex items-center justify-between mt-2">
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {user.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                  <button
                    className="btn btn-sm btn-outline ml-4 whitespace-nowrap"
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {editing && <EditProfile setEditing={setEditing} />}
    </>
  );
};

export default Profile;
