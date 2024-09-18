"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function NewTask({ params }) {
  const router = useRouter();
  const [takadata, setData] = useState("");

  useEffect(() => {
    let value = JSON.parse(localStorage.getItem("takadata")) || "";
    setData(value);

    if (!value) {
      redirect("/");
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "",
    project: params.id,
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
    Authorization: `Bearer ${takadata.token}`,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/create`,
        formData,
        { headers }
      );
      // Success
      setSuccess("Task created !");

      router.push(`/projects/${params.id}`);
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
          className="bg-blue-500 p-2 rounded-md hover:bg-blue-600 font-bold"
          type="button"
          onClick={() => router.push("/dashboard")}
        >
          {" "}
          Dashboard{" "}
        </button>
      </span>
      <main className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Create new task
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}
        <form onSubmit={handleSubmit} className="text-black">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              Task name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700">
              Task description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="priority" className="block text-gray-700">
              Task Priority
            </label>
            <input
              type="text"
              id="priority"
              name="priority"
              value={formData.priority}
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
            {loading ? "Processing..." : "Create"}
          </button>
        </form>
      </main>
    </section>
  );
}
