import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const EditProfile = ({ setEditing }) => {
  const user = useSelector((store) => store.user);
  const [photo, setPhoto] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (user) {
      setPhoto(user.photoUrl || "");
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setGender(user.gender || "");
      setAge(user.age || "");
      setAbout(user.about || "");
      setSkills(user.skills || []);
    }
  }, []);
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  const handleCancel = () => {
    if (user) {
      setPhoto(user.photoUrl || "");
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setGender(user.gender || "");
      setAge(user.age || "");
      setAbout(user.about || "");
      setSkills(user.skills || []);
    }
    setEditing(false);
  };
  const handleSave = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          photoUrl: photo,
          skills: skills,
          about: about,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(res.data));
      setShowSuccess(true);
      setTimeout(() => {
        window.location.reload();
        setEditing(false);
      }, 2000);
    } catch (err) {
      setEditing(false);
      console.error(err);
    }
  };

  return (
    <>
      {showSuccess && (
        <div
          role="alert"
          className="alert alert-success mb-4 w-full max-w-sm mx-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Your profile has been updated!</span>
        </div>
      )}

      <div className="flex flex-wrap justify-center items-start mt-10 gap-10 px-6">
        <div className="w-full max-w-sm bg-base-100 shadow-md p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Edit Profile</h2>
          <form className="space-y-3">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-2">
              <img
                src={
                  photo ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="Preview"
                className="w-24 h-24 object-cover rounded-full"
              />
              <div className="flex items-center w-full">
                <label className="text-sm font-medium w-1/4 mr-2">
                  Image URL:
                </label>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  className="input input-bordered input-sm w-4/5"
                />
              </div>
            </div>

            {/* First Name */}
            <div className="flex items-center">
              <label className="text-sm font-medium w-1/4 mr-2">
                First Name:
              </label>
              <input
                type="text"
                value={firstName}
                disabled
                className="input input-bordered input-sm w-4/5 bg-gray-100"
              />
            </div>

            {/* Last Name */}
            <div className="flex items-center">
              <label className="text-sm font-medium w-1/4 mr-2">
                Last Name:
              </label>
              <input
                type="text"
                value={lastName}
                disabled
                className="input input-bordered input-sm w-4/5 bg-gray-100"
              />
            </div>

            {/* Age */}
            <div className="flex items-center">
              <label className="text-sm font-medium w-1/4 mr-2">Age:</label>
              <input
                type="number"
                value={age}
                disabled
                className="input input-bordered input-sm w-4/5 bg-gray-100"
              />
            </div>

            {/* Gender */}
            <div className="flex items-center">
              <label className="text-sm font-medium w-1/4 mr-2">Gender:</label>
              <input
                type="text"
                value={gender}
                disabled
                className="input input-bordered input-sm w-4/5 bg-gray-100"
              />
            </div>

            {/* About */}
            <div className="flex items-start">
              <label className="text-sm font-medium w-1/4 mr-2 pt-1">
                About:
              </label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="textarea textarea-bordered textarea-sm w-4/5"
                rows={2}
              ></textarea>
            </div>

            {/* Skills */}
            <div className="flex items-start">
              <label className="text-sm font-medium w-1/4 mr-2 pt-1">
                Skills:
              </label>
              <input
                type="text"
                value={skills.join(", ")}
                onChange={(e) =>
                  setSkills(
                    e.target.value
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter((skill) => skill)
                  )
                }
                className="input input-bordered input-sm w-4/5"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-2 pt-2">
              <button
                onClick={handleSave}
                className="btn btn-primary btn-sm w-1/2"
                type="button"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="btn btn-outline btn-sm w-1/2"
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="card bg-base-100 w-80 shadow-md mt-8 p-4">
          <figure>
            <img
              src={
                photo ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="Profile"
              className="w-full h-52 object-cover"
            />
          </figure>

          <div className="card-body space-y-1 pt-3">
            <h2 className="card-title text-base">
              {firstName + " " + lastName}
            </h2>

            {(age || gender) && (
              <p className="text-sm text-gray-600">
                {age && `Age: ${age}`} {gender && `| Gender: ${gender}`}
              </p>
            )}

            {about && (
              <div>
                <h3 className="text-sm font-semibold">About</h3>
                <p className="text-sm text-gray-600">{about}</p>
              </div>
            )}

            {skills.length > 0 && (
              <ul className="list-disc list-inside text-sm text-gray-600">
                {skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
