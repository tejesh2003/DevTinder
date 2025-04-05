import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connection = useSelector((store) => store.connection);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-center mb-6">
        <h1 className="text-2xl font-bold text-center">Connections</h1>
      </div>

      {connection.length === 0 && (
        <div className="flex justify-center mt-10">
          <div className="alert alert-info w-fit shadow-lg">
            <span>No Connections Yet.</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {connection.map((user) => (
          <div
            key={user._id}
            className="mx-auto max-w-2xl flex bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={
                user.photoUrl ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="Profile"
              className="w-32 h-32 object-cover"
            />
            <div className="flex flex-col justify-between p-4 flex-1">
              <div>
                <h2 className="text-lg font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {user.age && `Age: ${user.age}`}{" "}
                  {user.gender && `| Gender: ${user.gender}`}
                </p>
                {user.about && (
                  <p className="text-sm mt-2 text-gray-700">
                    <strong>About:</strong> {user.about}
                  </p>
                )}
                {user.skills?.length > 0 && (
                  <p className="text-sm mt-2 text-gray-700">
                    <strong>Skills:</strong> {user.skills.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
