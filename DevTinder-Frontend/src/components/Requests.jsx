import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestsSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [requestsFetched, setRequestsFetched] = useState(false);
  const [item, setItem] = useState(0);

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

  const handlePrev = () => {
    setItem((prev) => (prev === 0 ? requests.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setItem((prev) => (prev === requests.length - 1 ? 0 : prev + 1));
  };
  const handleReject = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + `/request/review/rejected/${requests[item]._id}`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  const handleAccept = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + `/request/review/accepted/${requests[item]._id}`,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(removeRequests(res.data._id));
    } catch (err) {
      console.log(err);
    }
    if (item === requests.length - 1) {
      setItem(item - 1);
    }
  };

  return (
    <>
      {requests.length > 0 && (
        <div className="flex flex-col items-center justify-center mt-2">
          <h2 className="text-lg font-semibold mb-4">
            Total Requests: {requests.length}
          </h2>
          <div className="relative flex items-center">
            <button
              onClick={handlePrev}
              className="mr-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 cursor-pointer"
            >
              ⬅️
            </button>

            <div className="card bg-base-100 w-96 shadow-md h-130">
              <figure>
                <img
                  src={
                    requests[item]?.sender?.photoUrl ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt="Profile"
                  className="w-full h-64 object-cover"
                />
              </figure>

              <div className="card-body space-y-2 pt-4">
                <h2 className="card-title">
                  {requests[item]?.sender?.firstName +
                    " " +
                    requests[item]?.sender?.lastName}
                </h2>

                {(requests[item]?.sender?.age ||
                  requests[item]?.sender?.gender) && (
                  <p className="text-sm text-gray-600">
                    {requests[item]?.sender?.age &&
                      `Age: ${requests[item]?.sender?.age}`}{" "}
                    {requests[item]?.sender?.gender &&
                      `| Gender: ${requests[item].sender?.gender}`}
                  </p>
                )}

                {requests[item]?.sender?.about && (
                  <div>
                    <h3 className="text-sm font-semibold">About</h3>
                    <p className="text-sm text-gray-600">
                      {requests[item]?.sender?.about}
                    </p>
                  </div>
                )}

                {requests[item]?.sender?.skills?.length > 0 && (
                  <div className="flex items-center justify-between mt-2">
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {requests[item]?.sender?.skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-between mt-2 gap-2">
                  <button
                    onClick={handleReject}
                    className="btn btn-sm btn-error text-white hover:opacity-90 cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleAccept}
                    className="btn btn-sm btn-success text-white hover:opacity-90 cursor-pointer"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="ml-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 cursor-pointer"
            >
              ➡️
            </button>
          </div>
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
