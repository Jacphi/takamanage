"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [takadata, setData] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let value = JSON.parse(localStorage.getItem("takadata")) || "";

    if (!value) {
      redirect("/");
    } else {
      setData(value);
      const userId = value.userId;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${value.token}`,
      };

      axios
        .get("http://localhost:5000/auth/my-projects", { headers })
        .then((response) => {
          setProjects(response.data.projects);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("takadata");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <span className="flex justify-between max-w-5xl w-full my-4">
        <button
          type="button"
          className="bg-blue-500 p-2 rounded-md hover:bg-blue-600 font-bold"
          onClick={() => router.push("/projects/create")}
        >
          Create Project
        </button>

        <button
          className="bg-blue-500 p-2 rounded-md font-bold"
          type="button"
          onClick={() => handleLogout()}
        >
          {" "}
          Log out{" "}
        </button>
      </span>

      {projects && projects.length ? (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">
            Dashboard
          </h2>

          <ul className="list-none">
            {projects.map((project) => {
              return (
                <li
                  key={project._id}
                  className="shadow-gray-400 shadow-md p-5 rounded-md my-4 hover:bg-blue-300 hover:shadow cursor-pointer"
                  onClick={() => router.push(`projects/${project._id}`)}
                >
                  {" "}
                  <button>{project.name}</button>{" "}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div>No projects</div>
      )}
    </div>
  );
}
