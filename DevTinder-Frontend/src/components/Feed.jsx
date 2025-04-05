import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const [page, setPage] = useState(1);
  const [item, setItem] = useState(0);
  const dispatch = useDispatch();
  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
        params: {
          page: page,
        },
      });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getFeed();
  }, [page]);

  const onIgnore = async () => {
    try {
      await axios.post(
        BASE_URL + "/request/send/ignored/" + feed[item]._id,
        {},
        {
          withCredentials: true,
        }
      );
      const nextItem = item + 1;
      if (nextItem == 5) {
        setItem(0);
        setPage(page + 1);
      } else {
        setItem(nextItem);
      }
      console.log("Ignored");
    } catch (err) {
      console.log(err);
    }
  };

  const onInterested = async () => {
    try {
      console.log(feed[item]._id);
      await axios.post(
        BASE_URL + "/request/send/interested/" + feed[item]._id,
        {},
        {
          withCredentials: true,
        }
      );
      const nextItem = item + 1;
      if (nextItem == 5) {
        setItem(0);
        setPage(page + 1);
      } else {
        setItem(nextItem);
      }
      console.log("Interested");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {feed?.length > 0 && (
        <div className="flex items-center justify-center ">
          <div className="card bg-base-100 w-96 shadow-md p-4">
            <figure>
              <img
                src={
                  feed[item]?.photoUrl ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                alt="Profile"
              />
            </figure>

            <div className="card-body p-4">
              <h2 className="card-title text-center text-base">
                {feed[item]?.firstName + " " + feed[item]?.lastName}
              </h2>

              {feed[item]?.about && (
                <div className="mt-2">
                  <h3 className="text-sm font-semibold">About</h3>
                  <p className="text-xs text-gray-600">{feed[item].about}</p>
                </div>
              )}
              {feed[item]?.age && (
                <div className="mt-2">
                  <h3 className="text-sm font-semibold">Age</h3>
                  <p className="text-xs text-gray-600">{feed[item].age}</p>
                </div>
              )}
              {feed[item]?.gender && (
                <div className="mt-2">
                  <h3 className="text-sm font-semibold">Gender</h3>
                  <p className="text-xs text-gray-600">{feed[item].gender}</p>
                </div>
              )}

              {feed[item]?.skills && (
                <div className="mt-2">
                  <h3 className="text-sm font-semibold">Skills</h3>
                  <ul className="list-disc list-inside text-xs text-gray-600 pl-4">
                    {feed[item].skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-between mt-4">
                <button className="btn btn-error btn-sm" onClick={onIgnore}>
                  Ignored
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onClick={onInterested}
                >
                  Interested
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Feed;
