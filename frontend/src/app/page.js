"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();
  const [takadata, setData] = useState("");

  useEffect(() => {
    let value = localStorage.getItem("takadata") || "";
    setData(value);

    if (takadata) {
      redirect("/dashboard");
    }
  }, [takadata]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const headers = {
    "Content-Type": "application/json",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        formData,
        { headers }
      );
      // Success
      setSuccess("Registered successfully !");
      localStorage.setItem("takadata", JSON.stringify(response.data));
      setData(JSON.stringify(response.data));
    } catch (error) {
      // Handle errors
      setError("Error. Try again");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center flex-col">
      <span className="flex justify-between max-w-sm w-full my-4">
        <button
          type="button"
          disabled
          className="bg-blue-500 p-2 rounded-md font-bold"
        >
          Sign Up
        </button>

        <button
          className="bg-blue-500 p-2 rounded-md hover:bg-blue-600 font-bold"
          type="button"
          onClick={() => router.push("/login")}
        >
          {" "}
          Log in{" "}
        </button>
      </span>
      <main className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Registration
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}
        <form onSubmit={handleSubmit} className="text-black">
          <span className="mb-4">
            <label htmlFor="firstName" className="block text-gray-700">
              First name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </span>

          <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-700">
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } transition duration-300`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </form>
      </main>
    </section>
  );
}
