import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestsSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [requestsFetched, setRequestsFetched] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/recieved", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data));
    } catch (err) {
      console.log(err);
    } finally {
      setRequestsFetched(true);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [requests.length]);

  const handleReject = async (id) => {
    try {
      await axios.patch(
        BASE_URL + `/request/review/rejected/${id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequests(id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleAccept = async (id) => {
    try {
      const res = await axios.patch(
        BASE_URL + `/request/review/accepted/${id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequests(res.data._id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {requests.length > 0 && (
        <div className="flex flex-col items-center justify-center mt-4 space-y-4">
          <h1 className="text-2xl font-bold text-center mb-2">
            Requests: {requests.length}
          </h1>

          {requests.map((req) => (
            <div
              key={req._id}
              className="mx-auto w-full max-w-4xl flex bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={
                  req.sender?.photoUrl ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="Profile"
                className="w-32 h-32 object-cover"
              />

              <div className="flex justify-between items-center flex-1 p-4">
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold">
                    {req.sender?.firstName} {req.sender?.lastName}
                  </h2>

                  {(req.sender?.age || req.sender?.gender) && (
                    <p className="text-sm text-gray-600 mt-1">
                      {req.sender?.age && `Age: ${req.sender.age}`}{" "}
                      {req.sender?.gender && `| Gender: ${req.sender.gender}`}
                    </p>
                  )}

                  {req.sender?.about && (
                    <p className="text-sm mt-2 text-gray-700">
                      <strong>About:</strong> {req.sender.about}
                    </p>
                  )}

                  {req.sender?.skills?.length > 0 && (
                    <p className="text-sm mt-2 text-gray-700">
                      <strong>Skills:</strong> {req.sender.skills.join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleReject(req._id)}
                    className="btn btn-sm btn-error text-white hover:opacity-90"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAccept(req._id)}
                    className="btn btn-sm btn-success text-white hover:opacity-90"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {requestsFetched && requests.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-10">
          <div className="alert alert-info w-fit shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
              />
            </svg>
            <span>No more connection requests.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Requests;
