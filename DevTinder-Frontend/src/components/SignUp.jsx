import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    age: "",
    gender: "",
    photoUrl: "",
    about: "",
    skills: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      age: Number(form.age),
      skills: form.skills.split(",").map((skill) => skill.trim()),
    };

    try {
      await axios.post(BASE_URL + "/signup", payload);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card w-full max-w-md bg-base-300 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Create an Account</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              required
              minLength="4"
              maxLength="50"
              className="input input-bordered w-full"
              value={form.firstName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="input input-bordered w-full"
              value={form.lastName}
              onChange={handleChange}
            />

            <input
              type="email"
              name="emailId"
              placeholder="Email"
              required
              className="input input-bordered w-full"
              value={form.emailId}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="input input-bordered w-full"
              value={form.password}
              onChange={handleChange}
              title="Must be strong password (min 8 chars, uppercase, lowercase, number, symbol)"
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              className="input input-bordered w-full"
              value={form.age}
              onChange={handleChange}
              min="18"
              max="100"
            />

            <select
              name="gender"
              className="select select-bordered w-full"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">male</option>
              <option value="female">female</option>
            </select>

            <input
              type="text"
              name="photoUrl"
              placeholder="Photo URL (optional)"
              className="input input-bordered w-full"
              value={form.photoUrl}
              onChange={handleChange}
            />

            <textarea
              name="about"
              className="textarea textarea-bordered w-full"
              placeholder="About"
              value={form.about}
              onChange={handleChange}
            ></textarea>

            <input
              type="text"
              name="skills"
              placeholder="Skills (comma separated)"
              className="input input-bordered w-full"
              value={form.skills}
              onChange={handleChange}
            />

            <button type="submit" className="btn btn-primary w-full">
              Sign Up
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline font-semibold"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
